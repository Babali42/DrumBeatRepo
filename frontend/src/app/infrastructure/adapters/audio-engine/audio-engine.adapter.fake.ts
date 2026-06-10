import {IAudioEngine} from "../../../domain/ports/i-audio-engine";
import {Track} from "../../../domain/track";
import {StepIndex} from "../../../domain/step-index";

export class AudioEngineAdapterFake implements IAudioEngine {
  disableStep(_trackName: string, _stepIndex: number): void {
  }

  enableStep(_trackName: string, _stepIndex: number): void {
  }

  index: StepIndex = StepIndex(0);
  isPlaying: boolean = false;

  pause(): void {
  }

  playPause(): void {
    this.isPlaying = !this.isPlaying;
  }

  playTrack(_trackName: string): void {
  }

  setTracks(_tracks: readonly Track[]): void {
  }

}
