import {Injectable, NgZone} from "@angular/core";
import WAAClock from "waaclock";
import {AudioFilesService} from "./files/audio-files.service";
import {Track} from "src/app/core/domain/track";
import {IAudioEngine} from "../../../../core/domain/ports/secondary/i-audio-engine";
import {TempoAdapterService} from "../tempo-control/tempo-adapter.service";
import {Option} from "effect";
import {Seconds} from "../../../../core/domain/seconds";
import {StepIndex} from "../../../../core/domain/step-index";

@Injectable({
  providedIn: 'root'
})
export class AudioEngineAdapter implements IAudioEngine {
  constructor(private readonly zone: NgZone, private readonly tempoService: TempoAdapterService) {
    this.context = new AudioContext();
    document.addEventListener('click', this.resumeAudioContext.bind(this), {once: true});
  }

  private readonly audioFilesService = new AudioFilesService();
  private readonly context: AudioContext;
  private tracks: readonly Track[] = [];

  private clock: WAAClock | undefined;

  index: StepIndex = StepIndex(0);
  isPlaying = false;

  private readonly trackStepMap: Map<string, Map<number, WAAClock.Event>> = new Map();
  // ⚠ AudioBufferSourceNode objects cannot be reused.
  // Always create a new node for each playback.
  private readonly trackSampleBuilderMap: Map<string, () => AudioBufferSourceNode> = new Map();

  readonly pause = () => {
    this.isPlaying = false;
    this.clock!.stop();
  };

  private readonly uiNextStep = () => {
    this.zone.run(() => {
      const stepPosition = Math.floor(this.context.currentTime / this.tempoService.stepDuration);
      this.index = StepIndex(stepPosition % this.tempoService.signature);
    });
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
    this.clock = new WAAClock(this.context, {toleranceEarly: 0.1});
    this.clock.start();

    this.tracks.forEach((track) => {
      track.steps.steps.forEach((step, index) => {
        if (step)
          this.enableStep(track.fileName, StepIndex(index));
      })
    })

    this.clock.callbackAtTime(this.uiNextStep, this.tempoService.getNextStepTime(Seconds(this.context.currentTime), StepIndex(0)))
      .repeat(this.tempoService.stepDuration)
      .tolerance({late: 100})
  }

  setTracks(tracks: readonly Track[]) {
    if (this.isPlaying)
      this.pause();

    this.tracks = tracks;
    const trackNames = tracks.map(x => x.fileName);

    const loadPromises = trackNames.map(sample =>
      this.audioFilesService.getAudioBuffer(sample).then(arrayBuffer => {
        if (Option.isNone(arrayBuffer))
          return;

        const createNode = () => {
          const node = this.context.createBufferSource();
          node.buffer = Option.getOrThrow(arrayBuffer);
          node.connect(this.context.destination);
          return node;
        };
        this.trackSampleBuilderMap.set(sample, createNode);
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
    if (!this.clock)
      return;

    const event = this.clock.callbackAtTime((event: WAAClock.Event) => {
      const builder = this.trackSampleBuilderMap.get(trackName);

      if(builder == undefined)
        return;

      const bufferNode = builder();
      bufferNode.start(event.deadline);
    }, this.tempoService.getNextStepTime(Seconds(this.context.currentTime), stepIndex));
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
