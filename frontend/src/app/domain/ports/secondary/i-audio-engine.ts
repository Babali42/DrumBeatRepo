// domain/ports/secondary/i-audio-engine.ts

import { Track } from '../../track';

export interface IAudioEngine {
  index: number;
  bpm: number;
  isPlaying: boolean;
  play(): void;
  pause(): void;
  playPause(): void;

  setTracks(tracks: readonly Track[]): void;
  setBpm(bpm: number): void;
  setStepNumber(n: number): void;

  startBeat(trackName: string, stepIndex: number): void;
  stopBeat(trackName: string, stepIndex: number): void;

  playTrack(trackName: string): void;
}
