import { Track } from '../../track';

export interface IAudioEngine {
  readonly index: number;
  readonly bpm: number;
  readonly isPlaying: boolean;
  readonly play: () => void;
  readonly pause: () => void;
  readonly playPause: () => void;

  readonly setTracks : (tracks: readonly Track[]) => void;
  readonly setBpm: (bpm: number) => void;
  readonly setStepNumber: (n: number) => void;

  readonly startBeat: (trackName: string, stepIndex: number) => void;
  readonly stopBeat: (trackName: string, stepIndex: number) => void;

  readonly playTrack: (trackName: string) => void;
}
