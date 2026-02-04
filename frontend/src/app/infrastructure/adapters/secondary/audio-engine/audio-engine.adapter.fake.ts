import {IAudioEngine} from "../../../../core/domain/ports/secondary/i-audio-engine";
import {Track} from "../../../../core/domain/track";
import {StepIndex} from "../../../../core/domain/step-index";

export class AudioEngineAdapterFake implements IAudioEngine {
  disableStep(trackName: string, stepIndex: number): void {
  }

  enableStep(trackName: string, stepIndex: number): void {
  }

  index: StepIndex = StepIndex(0);
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
