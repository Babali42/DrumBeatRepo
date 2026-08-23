export interface EngineTrack {
  readonly name: string;
  readonly filename: string;
  readonly steps: readonly boolean[];
  readonly midiNote: number | null;
  readonly isMuted: boolean;
}

export interface SequencerState {
  readonly beat: string;
  readonly genre: string;
  readonly tracks: readonly EngineTrack[];
  readonly tempo: number;
  readonly historyLength: number;
  readonly futureLength: number;
}

export interface BeatMetadata {
  genre: string;
  label: string;
  filename: string;
}

declare global {
  var SequencerEngine: {
    dispatch(cmd: unknown): void;
    getState(): SequencerState;
    reset(): void;
  };

  var BeatLibrary: {
    loadBeatsManifest(): Promise<BeatMetadata[]>
  }
}
