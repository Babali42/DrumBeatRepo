export interface EngineTrack {
  readonly name: string;
  readonly fileName: string;
  readonly steps: readonly boolean[];
  readonly midiNote: number | null;
}

export interface SequencerState {
  readonly beat: string;
  readonly genre: string;
  readonly tracks: readonly EngineTrack[];
  readonly tempo: number;
  readonly historyLength: number;
  readonly futureLength: number;
}

declare global {
  var SequencerEngine: {
    dispatch(cmd: unknown): void;
    getState(): SequencerState;
    reset(): void;
  };
}
