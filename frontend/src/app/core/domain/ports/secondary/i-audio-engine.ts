import { Track } from '../../track';
import {StepIndex} from "../../step-index";

export interface IAudioEngineCommands {
  readonly playPause: () => void;
  readonly pause: () => void;

  readonly setTracks : (tracks: readonly Track[]) => void;

  readonly enableStep: (trackName: string, stepIndex: StepIndex) => void;
  readonly disableStep: (trackName: string, stepIndex: StepIndex) => void;

  readonly playTrack: (trackName: string) => void;
}

export interface IAudioEngineQuery {
  readonly index: StepIndex;
  readonly isPlaying: boolean;
}

export interface IAudioEngine extends IAudioEngineCommands, IAudioEngineQuery {

}
