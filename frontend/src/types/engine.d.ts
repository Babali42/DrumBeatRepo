export interface SequencerState {
  readonly beat: string;
  readonly genre: string;
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
