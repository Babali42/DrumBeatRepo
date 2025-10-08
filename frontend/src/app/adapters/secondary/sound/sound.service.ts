import {Injectable, NgZone} from "@angular/core";
import WAAClock from "waaclock";
import {AudioFilesService} from "./files/audio-files.service";
import {Track} from "src/app/domain/track";
import {IAudioEngine} from "../../../domain/ports/secondary/i-audio-engine";
import {Bpm} from "../../../domain/bpm";
import {TempoService} from "../../../domain/tempo.service";

@Injectable({
  providedIn: 'root'
})
export class SoundService implements IAudioEngine {

  constructor(private readonly zone: NgZone, ) {
    this.context = new AudioContext();
    document.addEventListener('click', this.resumeAudioContext.bind(this), {once: true});
  }


  private readonly tempoService = new TempoService(new Bpm(128), 16);
  bpm: Bpm = this.tempoService.bpm;
  private readonly audioFilesService = new AudioFilesService();
  private readonly context: AudioContext;
  private tracks: readonly Track[] = [];

  private clock: WAAClock | undefined;

  index: number = 0;
  isPlaying = false;

  private readonly trackStepMap: Map<string, Map<number, WAAClock.Event>> = new Map();
  private readonly trackSampleBuilderMap: Map<string, () => AudioBufferSourceNode> = new Map();

  private readonly pause = () => this.clock!.stop();

  private readonly uiNextStep = () => {
    this.zone.run(() => {
      const stepPosition = Math.floor(this.context.currentTime / this.tempoService.stepDuration);
      this.index = stepPosition % this.tempoService.signature;
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
    this.clock = new WAAClock(this.context, {toleranceEarly: 0.1});
    this.clock.start();

    this.tracks.forEach((track) => {
      track.steps.steps.forEach((step, index) => {
        if (step)
          this.enableStep(track.fileName, index);
      })
    })

    this.clock.callbackAtTime(this.uiNextStep, this.tempoService.getNextStepTime(this.context.currentTime,0))
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
        const createNode = () => {
          const node = this.context.createBufferSource();
          node.buffer = arrayBuffer;
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

    this.isPlaying = !this.isPlaying;
  }

  setBpm(newTempo: Bpm) {
    const events = Array.from(this.trackStepMap.values()).flatMap(x => Array.from(x.values()));

    if (this.clock) {
      this.clock.timeStretch(this.context.currentTime, events, this.bpm.value / newTempo.value);
    }

    this.tempoService.setBpm(newTempo);
  }

  setStepNumber(n: number) {
    this.tempoService.setSignature(n)
  }

  enableStep(trackName: string, stepIndex: number): void {
    if (!this.clock)
      return;

    const event = this.clock.callbackAtTime((event: WAAClock.Event) => {
      const bufferNode = this.trackSampleBuilderMap.get(trackName)!();
      bufferNode.start(event.deadline);
    }, this.tempoService.getNextStepTime(this.context.currentTime, stepIndex));
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
    const source = this.trackSampleBuilderMap.get(trackName)!();
    source.connect(this.context.destination);
    source.start();
  }
}
