import { Track } from '../../track';

export interface IAudioEngineCommands {
  readonly playPause: () => void;
  readonly pause: () => void;

  readonly setTracks : (tracks: readonly Track[]) => void;

  readonly enableStep: (trackName: string, stepIndex: number) => void;
  readonly disableStep: (trackName: string, stepIndex: number) => void;

  readonly playTrack: (trackName: string) => void;
}

export interface IAudioEngineQuery {
  readonly index: number;
  readonly isPlaying: boolean;
}

export interface IAudioEngine extends IAudioEngineCommands, IAudioEngineQuery {

}
