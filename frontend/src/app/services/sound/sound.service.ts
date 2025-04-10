import {Injectable} from "@angular/core";
import {Track} from "../../domain/track";
import * as WAAClock from "waaclock";
import {AudioFilesService} from "../files/audio-files.service";

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private readonly audioFilesService = new AudioFilesService();
  static readonly maxBpm = 1300;
  static readonly minBpm = 30;
  bpm: number = 450;
  index: number = 0;
  signature = 8;
  beatDur = 60/this.bpm;
  barDur = this.signature * this.beatDur;

  isPlaying = false;
  private context: AudioContext;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  private clock: WAAClock;
  private event: WAAClock.Event | undefined;

  beats: Beats = {};
  soundBank: SoundBank = {};
  // @ts-ignore
  private uiEvent: WAAClock.Event;

  constructor() {
    this.context = new AudioContext();
  }

  play(){
    this.clock = new WAAClock(this.context);
    this.clock.start();

    this.startBeat("psytrance/kick.wav", 0);
    this.startBeat("psytrance/bass.wav", 1);
    this.startBeat("psytrance/bass.wav", 2);
    this.startBeat("psytrance/bass.wav", 3);
    this.startBeat("psytrance/kick.wav", 4);
    this.startBeat("psytrance/bass.wav", 5);
    this.startBeat("psytrance/bass.wav", 6);
    this.startBeat("psytrance/bass.wav", 7);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.uiEvent = this.clock.callbackAtTime(this.uiNextBeat, this.nextBeatTime(0))
      .repeat(this.beatDur)
      .tolerance({late: 100})
  }

  pause(){
    this.clock.stop();
  }

  setTracks(tracks: readonly Track[]) {
    const trackNames = tracks.map(x => x.fileName);
    this.loadTracks(trackNames);
  }

  private loadTracks(trackNames: string[]) {
    const loadPromises = trackNames.map(sample =>
      this.audioFilesService.getAudioBuffer(sample).then(arrayBuffer => {
        const createNode = () => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const node = this.context.createBufferSource();
          node.buffer = arrayBuffer
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          node.connect(this.context.destination)
          return node
        };
        this.soundBank[sample] = { createNode: createNode }
        console.log(this.soundBank[sample]);
      })
    );

    Promise.all(loadPromises)
      .then(() => {})
      .catch(() => {});
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  playPause() : Promise<void> {

    if(this.isPlaying)
      this.pause()
    else
      this.play();

    this.isPlaying = !this.isPlaying;

    return new Promise( () => {})
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setBpm(a : any) {

  }

  setStepNumber(n: number) {
    console.log(n);
  }

  startBeat = (track: string, beatInd: number): void => {
    console.log(track, beatInd);
    console.log(this.soundBank)
    const event = this.clock.callbackAtTime((event: WAAClock.Event) => {
      const bufferNode = this.soundBank[track].createNode();
      bufferNode.start(event.deadline);
    }, this.nextBeatTime(beatInd));
    event.repeat(this.barDur);
    event.tolerance({ late: 0.01 });

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

  uiNextBeat = function() {

  }

  playTrack(name: string) {
    const source = this.soundBank[name].createNode();
    source.connect(this.context.destination);
    source.start();
  }
}

interface Beats {
  [track: string]: {
    [beatInd: number]: WAAClock.Event; // WAAClock event type (use correct type if you have WAAClock typings)
  };
}

interface SoundBank {
  [track: string]: {
    createNode: () => AudioBufferSourceNode;
  };
}
