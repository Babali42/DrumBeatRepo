export interface SequencerState {
  beat : string;
  genre : string;
}

interface SequencerEngineStatic {
  dispatch(cmd: any): void;
  getState(): SequencerState;
  reset(): void;
}

declare var SequencerEngine: SequencerEngineStatic;
