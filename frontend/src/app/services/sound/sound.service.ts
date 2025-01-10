import {Injectable} from '@angular/core';
import {Sample} from '../../domain/sample';
import {Track} from '../../domain/track';
import {AudioFilesService} from "../files/audio-files.service";
import {SoundGeneratorService} from "./sound-generator.service";
import {LoadingBarService} from '@ngx-loading-bar/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  static maxBpm = 1300;
  static minBpm = 30;
  bpm: number = 120;
  isPlaying: boolean = false;
  index: number = 0;
  private samples: Sample[] = [];
  private context: AudioContext;
  private tracks: Track[] = [];
  private playbackSource: AudioBufferSourceNode;
  private stepNumber: number = 16;
  private audioFilesService = new AudioFilesService();
  private loopBuffer: AudioBuffer | null = null;

  constructor(
    private soundGeneratorService: SoundGeneratorService,
    private loader: LoadingBarService
  ) {
    this.context = new AudioContext();
    this.playbackSource = new AudioBufferSourceNode(this.context);
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

  setTracks(tracks: Track[]) {
    this.tracks = tracks;
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
