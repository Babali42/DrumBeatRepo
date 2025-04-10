import {Injectable} from "@angular/core";
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
  index: number = 0;
  isPlaying = false;

  private beatDur = this.getBeatDuration(this.bpm);
  private signature = 4;
  private barDur = this.signature * this.beatDur;
  private beats: Beats = {};
  private soundBank: SoundBank = {};

  constructor() {
    this.context = new AudioContext();
  }

  play() {
    this.clock = new WAAClock(this.context);
    this.clock.start();

    this.tracks.forEach((track) => {
      track.steps.forEach((step, index) => {
        if (step)
          this.startBeat(track.fileName, index);
      })
    })
    // eslint-disable-next-line @typescript-eslint/unbound-method
    // this.uiEvent = this.clock.callbackAtTime(this.uiNextBeat, this.nextBeatTime(0))
    //   .repeat(this.beatDur)
    //   .tolerance({late: 100})
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
    this.beatDur = this.getBeatDuration(this.bpm);
    this.barDur = this.signature * this.beatDur;
  }

  setStepNumber(n: number) {
    this.signature = n;
    this.barDur = this.signature * this.beatDur;
  }

  startBeat = (track: string, beatInd: number): void => {
    const event = this.clock.callbackAtTime((event: WAAClock.Event) => {
      const bufferNode = this.soundBank[track].createNode();
      bufferNode.start(event.deadline);
    }, this.nextBeatTime(beatInd));
    event.repeat(this.barDur);

    if (!this.beats[track]) this.beats[track] = {};
    this.beats[track][beatInd] = event;
  };

  nextBeatTime = (beatInd: number): number => {
    const currentTime = this.context.currentTime;
    const currentBar = Math.floor(currentTime / this.barDur);
    const currentBeat = Math.round(currentTime % this.barDur);
    return currentBeat < beatInd
      ? currentBar * this.barDur + beatInd * this.beatDur
      : (currentBar + 1) * this.barDur + beatInd * this.beatDur;
  };

  playTrack(name: string) {
    const source = this.soundBank[name].createNode();
    source.connect(this.context.destination);
    source.start();
  }

  private getBeatDuration(bpm: number): number {
    return 60 / (bpm * 4);
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
