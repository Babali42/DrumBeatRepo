export type CompactTrack = {
  readonly name: string;
  readonly fileName: string;
  readonly steps: string; // like "100010001000..." or even base64 encoded binary
};
