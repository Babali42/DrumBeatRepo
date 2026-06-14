export interface SequencerState {
  beat: string;
  genre: string;
}

declare global {
  var SequencerEngine: {
    dispatch(cmd: any): void;
    getState(): SequencerState;
    reset(): void;
  };
}
