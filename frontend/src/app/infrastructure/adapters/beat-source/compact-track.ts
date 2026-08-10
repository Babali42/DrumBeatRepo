export type CompactTrack = {
  readonly name: string;
  readonly fileName: string;
  readonly steps: string; // like "100010001000..." or even base64 encoded binary
  readonly isMuted?: boolean;
  readonly midiNote?: number;
  readonly beatsPerBar: number;
  readonly subdivisionsPerBeat: number;
};
