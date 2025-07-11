import { Track } from '../../track';
import {Bpm} from "../../bpm";

export interface IAudioEngineCommands {
  readonly playPause: () => void;

  readonly setTracks : (tracks: readonly Track[]) => void;
  readonly setBpm: (bpm: Bpm) => void;
  readonly setStepNumber: (n: number) => void;

  readonly enableStep: (trackName: string, stepIndex: number) => void;
  readonly disableStep: (trackName: string, stepIndex: number) => void;

  readonly playTrack: (trackName: string) => void;
}

export interface IAudioEngineQuery {
  index: number;
  isPlaying: boolean;
  bpm: Bpm;
}

export interface IAudioEngine extends IAudioEngineCommands, IAudioEngineQuery {

}
