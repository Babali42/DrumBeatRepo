import {Injectable, NgZone} from "@angular/core";
import WAAClock from "waaclock";
import {AudioFilesService} from "./files/audio-files.service";
import {Track} from "src/app/domain/track";
import {IAudioEngine} from "../../../domain/ports/secondary/i-audio-engine";
import {Bpm} from "../../../domain/bpm";

@Injectable({
  providedIn: 'root'
})
export class SoundService implements IAudioEngine {

  constructor(private readonly zone: NgZone) {
    this.context = new AudioContext();
    document.addEventListener('click', this.resumeAudioContext.bind(this), {once: true});
  }

  private readonly audioFilesService = new AudioFilesService();
  private readonly context: AudioContext;
  private tracks: readonly Track[] = [];

  // @ts-expect-error
  private clock: WAAClock;

  bpm: Bpm = new Bpm(128);
  index: number = 0;
  isPlaying = false;
  private signature = 16;

  private readonly getStepDuration = (bpm: Bpm): number => 60 / (bpm.value * (this.signature / 4));
  private stepDuration = this.getStepDuration(this.bpm);
  private readonly getBarDur = () => this.signature * this.stepDuration;
  private barDur = this.getBarDur();

  private readonly trackStepMap: Map<string, Map<number, WAAClock.Event>> = new Map();
  private readonly trackSampleBuilderMap: Map<string, () => AudioBufferSourceNode> = new Map();

  readonly getCurrentBar = (barDuration: number) => Math.floor(this.context.currentTime / barDuration);
  readonly nextStepTime = (stepIndex: number): number => this.getCurrentBar(this.barDur) * this.barDur + stepIndex * this.stepDuration;
  readonly pause = () => this.clock.stop();

  private readonly uiNextStep = () => {
    this.zone.run(() => {
      this.index = this.getCurrentBar(this.stepDuration) % this.signature;
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

    this.clock.callbackAtTime(this.uiNextStep, this.nextStepTime(0))
      .repeat(this.stepDuration)
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

    this.bpm = newTempo;
    this.stepDuration = this.getStepDuration(this.bpm);
    this.barDur = this.getBarDur();
  }

  setStepNumber(n: number) {
    this.signature = n;
    this.barDur = this.getBarDur();
  }

  enableStep(trackName: string, stepIndex: number): void {
    if (!this.clock)
      return;

    const event = this.clock.callbackAtTime((event: WAAClock.Event) => {
      const bufferNode = this.trackSampleBuilderMap.get(trackName)!();
      bufferNode.start(event.deadline);
    }, this.nextStepTime(stepIndex));
    event.repeat(this.barDur);

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
