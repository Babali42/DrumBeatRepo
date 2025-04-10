import {Injectable} from '@angular/core';
import {Sample} from './sample';
import {Track} from '../../domain/track';
import {AudioFilesService} from "../files/audio-files.service";
import {SoundGeneratorService} from "./sound-generator.service";
import {LoadingBarService} from '@ngx-loading-bar/core';
import * as WAAClock from "waaclock";

@Injectable({
  providedIn: 'root'
})
export class SoundServiceA {
  private readonly audioFilesService = new AudioFilesService();
  private readonly context: AudioContext;

  static readonly maxBpm = 1300;
  static readonly minBpm = 30;

  bpm: number = 120;
  isPlaying: boolean = false;
  index: number = 0;

  private samples: Array<Sample> = [];
  private tracks: Array<Track> = [];

  private stepNumber: number = 16;
  private playbackSource: AudioBufferSourceNode;
  private loopBuffer: AudioBuffer | null = null;

  constructor(
    private soundGeneratorService: SoundGeneratorService,
    private loader: LoadingBarService
  ) {
    this.context = new AudioContext();
    this.playbackSource = new AudioBufferSourceNode(this.context);

    const clock = new WAAClock(this.context);
    clock.start()
    const event = clock.callbackAtTime(function() { console.log('wow!') }, 13);
    event.repeat(10);
  }

  async playPause(): Promise<void> {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      if (!this.loopBuffer) {
        this.loopBuffer = await this.soundGeneratorService.getRenderedBuffer(
          this.tracks,
          this.samples,
          this.bpm,
          this.stepNumber
        );
      }
      this.play();
    } else {
      this.pause();
    }

    const clock = new WAAClock(this.context);
    clock.start();

    const event = clock.callbackAtTime(() => {
      console.log('wow!');
    }, this.context.currentTime + 1); // make sure it's in the future

    event.repeat(1); // repeat every 1 second
  }

  pause() {
    this.playbackSource.stop(this.context.currentTime);
    this.reset();
  }

  private playSound(loopBuffer: AudioBuffer) {
    const source = this.context.createBufferSource();
    source.buffer = loopBuffer;
    source.connect(this.context.destination);
    source.loop = true;
    source.loopStart = source.buffer.duration / 2;
    source.loopEnd = source.buffer.duration;
    const startTime = this.context.currentTime;
    source.start();

    const updateDisplay = () => {
      const currentTime = this.context.currentTime - startTime;
      this.index = Math.trunc(((currentTime * 1000) / this.getMillisStepFromBpm()) % this.stepNumber);
      if (this.isPlaying)
        requestAnimationFrame(updateDisplay);
    };

    updateDisplay();

    if (this.playbackSource.buffer) {
      this.playbackSource.stop(this.context.currentTime);
    }
    this.playbackSource = source;
  }

  private getMillisStepFromBpm(): number {
    const beat = 60000 / this.bpm;
    let quarterBeat = beat / 4;
    quarterBeat = Math.min(quarterBeat, 1000);
    quarterBeat = Math.max(quarterBeat, 10);
    return quarterBeat;
  }

  reset(): void {
    this.isPlaying = false;
    this.index = 0;
  }

  resetLoopBuffer(): void {
    this.loopBuffer = null;
  }

  setBpm(bpm: number): void {
    this.bpm = bpm;
  }

  setTracks(tracks: readonly Track[]) {
    this.tracks = [...tracks];
    const trackNames = tracks.map(x => x.fileName);
    this.loadTracks(trackNames);
  }

  private loadTracks(trackNames: string[]) {
    this.loader.start();
    trackNames.forEach(x => this.samples.push({fileName: x}));
    const loadPromises = this.samples.map(sample =>
      this.audioFilesService.getAudioBuffer(sample.fileName).then(arrayBuffer => sample.sample = arrayBuffer)
    );

    Promise.all(loadPromises)
      .then(() => this.loader.complete())
      .catch(() => this.loader.complete());
  }


  setStepNumber(length: number) {
    this.stepNumber = length;
  }

  async generateLoopBuffer(): Promise<void> {
    this.loopBuffer = await this.soundGeneratorService.getRenderedBuffer(
      this.tracks,
      this.samples,
      this.bpm,
      this.stepNumber
    );
  }

  play() : void {
    if(!this.loopBuffer)
      return;
    this.playSound(this.loopBuffer);
  }

  playTrack(trackName: string) {
    const source = this.context.createBufferSource();
    const fileName = this.tracks.find(x => x.name == trackName)?.fileName;
    source.buffer = this.samples.find(x => x.fileName === fileName)!.sample!;
    source.connect(this.context.destination);
    source.start();
  }
}
