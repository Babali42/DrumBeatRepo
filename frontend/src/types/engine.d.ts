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
  readonly numberOfBar: number;
  readonly historyLength: number;
  readonly futureLength: number;
}

export interface BeatMetadata {
  readonly genre: string;
  readonly label: string;
  readonly filename: string;
}

export interface DrumSample {
  readonly name: string;
  readonly filename: string;
  readonly midiNote: number;
  readonly drumCategory: string;
}

export interface DrumSampleGroup {
  readonly groupName: string;
  readonly samples: readonly DrumSample[];
}

declare global {
  const SequencerEngine: {
    dispatch(cmd: unknown): Promise<void>;
    getState(): SequencerState;
    reset(): void;
    getDrumSamples(): Promise<readonly DrumSampleGroup[]>;
  };

  const BeatLibrary: {
    loadBeatsManifest(): Promise<readonly BeatMetadata[]>
  }
}
