import {IAudioEngine} from "../../../domain/ports/secondary/i-audio-engine";
import {Track} from "../../../domain/track";

export class SoundServiceFake implements IAudioEngine {
  disableStep(trackName: string, stepIndex: number): void {
  }

  enableStep(trackName: string, stepIndex: number): void {
  }

  index: number = 0;
  isPlaying: boolean = false;

  pause(): void {
  }

  playPause(): void {
  }

  playTrack(trackName: string): void {
  }

  setTracks(tracks: readonly Track[]): void {
  }

}
