import {Injectable, NgZone} from "@angular/core";
import {Track} from "../../domain/track";
import * as WAAClock from "waaclock";
import {AudioFilesService} from "../files/audio-files.service";

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  static readonly maxBpm = 1300;
  static readonly minBpm = 30;

  private readonly audioFilesService = new AudioFilesService();

  private tracks: readonly Track[] = [];
  private context: AudioContext;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error: Type definition for WAAClock might be missing or incorrect
  private clock: WAAClock;

  bpm: number = 128;
  static index: number = 0;
  isPlaying = false;

  private stepDuration = this.getStepDuration(this.bpm);
  private signature = 16;
  private barDur = this.signature * this.stepDuration;
  private beats: Beats = {};
  private soundBank: SoundBank = {};
  private uiNextStep = () => {
    this.zone.run(() => {
      const currentTime = this.context.currentTime;
      const currentBar = Math.floor(currentTime / (this.stepDuration));
      SoundService.index = (currentBar+ 1) % this.signature;
    });
  };

  constructor(private zone: NgZone) {
    this.context = new AudioContext();
    document.addEventListener('click', this.resumeAudioContext.bind(this), { once: true });
  }

  private resumeAudioContext() {
    if (this.context.state === 'suspended') {
      this.context.resume().then(() => {
        console.log('AudioContext resumed');
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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const node = this.context.createBufferSource();
          node.buffer = arrayBuffer;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          node.connect(this.context.destination);
          return node;
        };
        this.soundBank[sample] = {createNode: createNode}
        console.log(this.soundBank[sample]);
      })
    );

    Promise.all(loadPromises)
      .then(() => {})
      .catch(() => {});
  }

  playPause(): Promise<void> {
    if (this.isPlaying)
      this.pause()
    else
      this.play();

    this.isPlaying = !this.isPlaying;

    return new Promise( () => {})
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setBpm(a: number) {
    this.bpm = a;
    this.stepDuration = this.getStepDuration(this.bpm);
    this.barDur = this.signature * this.stepDuration;
  }

  setStepNumber(n: number) {
    this.signature = n;
    this.barDur = this.signature * this.stepDuration;
  }

  startBeat(track: string, stepIndex: number): void {
    const event = this.clock.callbackAtTime((event: WAAClock.Event) => {
      const bufferNode = this.soundBank[track].createNode();
      bufferNode.start(event.deadline);
    }, this.nextStepTime(stepIndex));
    event.repeat(this.barDur);

    if (!this.beats[track]) this.beats[track] = {};
      this.beats[track][stepIndex] = event;
  };

  stopBeat(track: string, beatInd: number) : void {
    const event = this.beats[track][beatInd]
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

  playTrack(name: string) {
    const source = this.soundBank[name].createNode();
    source.connect(this.context.destination);
    source.start();
  }

  private getStepDuration(bpm: number): number {
    return 60 / (bpm * ( this.signature / 4));
  }
}

interface Beats {
  [track: string]: {
    [beatInd: number]: WAAClock.Event;
  };
}

interface SoundBank {
  [track: string]: {
    createNode: () => AudioBufferSourceNode;
  };
}
