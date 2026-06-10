import {Injectable, signal} from "@angular/core";
import WAAClock from "waaclock";
import {AudioFilesService} from "./files/audio-files.service";
import {Track} from "src/app/domain/track";
import {IAudioEngine} from "../../../domain/ports/i-audio-engine";
import {TempoAdapterService} from "../tempo-control/tempo-adapter.service";
import {Option} from "effect";
import {Seconds} from "../../../domain/seconds";
import {StepIndex} from "../../../domain/step-index";

@Injectable({
  providedIn: 'root'
})
export class AudioEngineAdapter implements IAudioEngine {
  constructor(private readonly tempoService: TempoAdapterService) {
    this.context = new AudioContext();
    document.addEventListener('click', this.resumeAudioContext.bind(this), {once: true});
  }

  private readonly audioFilesService = new AudioFilesService(fetch.bind(globalThis), () => this.context);
  private readonly context: AudioContext;
  private tracks: readonly Track[] = [];

  private clock: Option.Option<WAAClock> = Option.none();
  private timerId: ReturnType<typeof setInterval> | null = null;
  private playStartTime: Seconds = Seconds(0);

  private readonly _index = signal(StepIndex(0));
  get index(): StepIndex { return this._index(); }
  set index(v: StepIndex) { this._index.set(v); }

  isPlaying = false;

  private readonly trackStepMap: Map<string, Map<number, WAAClock.Event>> = new Map();
  // ⚠ AudioBufferSourceNode objects cannot be reused.
  // Always create a new node for each playback.
  private readonly trackSampleBuilderMap: Map<string, () => AudioBufferSourceNode> = new Map();

  readonly pause = () => {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    for (const [, stepMap] of this.trackStepMap) {
      for (const [, event] of stepMap) {
        event.clear();
      }
    }
    this.trackStepMap.clear();
    this.clock = Option.none();
  };

  private resumeAudioContext() {
    if (this.context.state === 'suspended') {
      this.context.resume().then(() => {
      }).catch(err => {
        console.error('Failed to resume AudioContext', err);
      });
    }
  }

  play() {
    this.isPlaying = true;
    this.playStartTime = Seconds(this.context.currentTime);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
    const clockInstance = new (WAAClock as any)(this.context, {
      tickMethod: 'manual',
      toleranceEarly: 0.1
    }) as WAAClock;
    this.clock = Option.some(clockInstance);
    clockInstance.start();

    const {stepDuration, numberOfSteps} = this.tempoService;
    this.timerId = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      (clockInstance as any).tick();
      if (this.isPlaying) {
        const elapsed = this.context.currentTime - this.playStartTime;
        this.index = StepIndex(Math.floor(elapsed / stepDuration) % numberOfSteps);
      }
    }, 25);

    this.tracks.forEach(t => t.steps.steps.forEach((s, i) => {
      if (s) this.enableStep(t.name, StepIndex(i));
    }));
  }

  setTracks(tracks: readonly Track[]) {
    if (this.isPlaying)
      this.pause();

    this.tracks = tracks;
    const trackNames = tracks.map(x => x.name);

    const loadPromises = trackNames.map(trackName =>
      this.audioFilesService.getAudioBuffer(tracks.find(x => x.name == trackName)!.fileName).then(arrayBuffer => {
        if (Option.isNone(arrayBuffer))
          return;

        const createNode = () => {
          const node = this.context.createBufferSource();
          node.buffer = Option.getOrThrow(arrayBuffer);
          node.connect(this.context.destination);
          return node;
        };
        this.trackSampleBuilderMap.set(trackName, createNode);
      })
    );

    Promise.all(loadPromises)
      .then(() => {
      })
      .catch(() => {
      });
  }

  playPause(): void {
    if (this.isPlaying)
      this.pause()
    else
      this.play();
  }

  enableStep(trackName: string, stepIndex: StepIndex): void {
    if (Option.isNone(this.clock))
      return;

    const elapsed = this.context.currentTime - this.playStartTime;
    const absoluteDeadline = this.playStartTime + this.tempoService.getNextStepTime(Seconds(elapsed), stepIndex);
    const event = Option.getOrThrow(this.clock).callbackAtTime((event: WAAClock.Event) => {
      const builder = this.trackSampleBuilderMap.get(trackName);

      if(builder == undefined)
        return;

      const bufferNode = builder();
      bufferNode.start(event.deadline);
    }, absoluteDeadline);
    event.repeat(this.tempoService.barDuration);

    if (!this.trackStepMap.get(trackName)) this.trackStepMap.set(trackName, new Map());
    this.trackStepMap.get(trackName)!.set(stepIndex, event);
  };

  disableStep(track: string, beatInd: number): void {
    const map = this.trackStepMap.get(track);
    if (!map) return;
    (map.get(beatInd)!).clear()
  }

  playTrack(trackName: string) {
    const builder = this.trackSampleBuilderMap.get(trackName);

    if(builder == undefined)
      return;

    const bufferNode = builder();
    bufferNode.connect(this.context.destination);
    bufferNode.start();
  }
}
