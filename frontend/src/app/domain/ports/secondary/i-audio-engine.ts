// domain/ports/secondary/i-audio-engine.ts

import { Track } from '../../track';

export interface IAudioEngine {
  index: number;
  bpm: number;
  isPlaying: boolean;
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
