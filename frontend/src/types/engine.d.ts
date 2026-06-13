declare module "src/types/engine" {
  export interface SequencerState {
    beat: string;
    genre: string;
  }

  export var SequencerEngine: {
    dispatch(cmd: any): void;
    getState(): SequencerState;
    reset(): void;
  };
}
