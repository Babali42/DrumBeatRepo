export interface EngineTrack {
  readonly name: string;
  readonly filename: string;
  readonly steps: readonly boolean[];
  readonly midiNote: number | null;
  readonly isMuted: boolean;
  readonly isSolo: boolean;
}

export interface SequencerState {
  readonly beat: string;
  readonly genre: string;
  readonly tracks: readonly EngineTrack[];
  readonly tempo: number;
  readonly beatsPerBar: number;
  readonly subdivisionsPerBeat: number;
  readonly numberOfBars: number;
  readonly historyLength: number;
  readonly futureLength: number;
}

export interface BeatMetadata {
  readonly genre: string;
  readonly label: string;
  readonly filename: string;
}

declare global {
  const SequencerEngine: {
    dispatch(cmd: unknown): Promise<void>;
    getState(): SequencerState;
    reset(): void;
  };

  const BeatLibrary: {
    loadBeatsManifest(): Promise<readonly BeatMetadata[]>
  }
}
