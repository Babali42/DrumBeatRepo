import {Injectable, NgZone} from "@angular/core";
import WAAClock from "waaclock";
import {AudioFilesService} from "./files/audio-files.service";
import { Track } from "src/app/domain/track";
import {IAudioEngine} from "../../../domain/ports/secondary/i-audio-engine";

@Injectable({
  providedIn: 'root'
})
export class SoundService implements IAudioEngine {
  static readonly maxBpm = 1300;
  static readonly minBpm = 30;

  private readonly audioFilesService = new AudioFilesService();
  private readonly context: AudioContext;

  private tracks: readonly Track[] = [];

  // @ts-expect-error: Type definition for WAAClock might be missing or incorrect
  private clock: WAAClock;

  bpm: number = 128;
  index: number = 0;
  isPlaying = false;

  private stepDuration = this.getStepDuration(this.bpm);
  private signature = 16;
  private barDur = this.signature * this.stepDuration;

  private readonly trackStepMap: Map<string, Map<number, WAAClock.Event>> = new Map();
  private readonly trackSampleBuilderMap: Map<string, () => AudioBufferSourceNode> = new Map();

  private readonly uiNextStep = () => {
    this.zone.run(() => {
      const currentTime = this.context.currentTime;
      const currentBar = Math.floor(currentTime / (this.stepDuration));
      this.index = (currentBar+ 1) % this.signature;
    });
  };

  constructor(private readonly zone: NgZone) {
    this.context = new AudioContext();
    document.addEventListener('click', this.resumeAudioContext.bind(this), { once: true });
  }

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
      track.steps.forEach((step, index) => {
        if (step)
          this.startBeat(track.fileName, index);
      })
    })

    this.clock.callbackAtTime(this.uiNextStep, this.nextStepTime(0))
      .repeat(this.stepDuration)
      .tolerance({late: 100})
  }

  pause() {
    this.clock.stop();
  }

  setTracks(tracks: readonly Track[]) {
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
      .then(() => {})
      .catch(() => {});
  }

  playPause() : void {
    if (this.isPlaying)
      this.pause()
    else
      this.play();

    this.isPlaying = !this.isPlaying;
  }

  setBpm(a: number) {
    const events = Array.from(this.trackStepMap.values()).flatMap(x => Array.from(x.values()));

    if (this.clock) {
      this.clock.timeStretch(this.context.currentTime, events, this.bpm / a);
    }

    this.bpm = a;
    this.stepDuration = this.getStepDuration(this.bpm);
    this.barDur = this.signature * this.stepDuration;
  }

  setStepNumber(n: number) {
    this.signature = n;
    this.barDur = this.signature * this.stepDuration;
  }

  startBeat(trackName: string, stepIndex: number): void {
    if(!this.clock)
      return;

    const event = this.clock.callbackAtTime((event: WAAClock.Event) => {
      const bufferNode = this.trackSampleBuilderMap.get(trackName)!();
      bufferNode.start(event.deadline);
    }, this.nextStepTime(stepIndex));
    event.repeat(this.barDur);

    if (!this.trackStepMap.get(trackName)) this.trackStepMap.set(trackName, new Map());
      this.trackStepMap.get(trackName)!.set(stepIndex, event);
  };

  stopBeat(track: string, beatInd: number) : void {
    const map = this.trackStepMap.get(track);

    if(!map)
      return;

    const event = map.get(beatInd)!;
    event.clear()
  }

  nextStepTime = (stepIndex: number): number => {
    const currentTime = this.context.currentTime;
    const currentBar = Math.floor(currentTime / this.barDur);
    const currentBeat = Math.round(currentTime % this.barDur);
    return currentBeat < stepIndex
      ? currentBar * this.barDur + stepIndex * this.stepDuration
      : (currentBar + 1) * this.barDur + stepIndex * this.stepDuration;
  };

  playTrack(trackName: string) {
    const source = this.trackSampleBuilderMap.get(trackName)!();
    source.connect(this.context.destination);
    source.start();
  }

  private getStepDuration(bpm: number): number {
    return 60 / (bpm * ( this.signature / 4));
  }
}
