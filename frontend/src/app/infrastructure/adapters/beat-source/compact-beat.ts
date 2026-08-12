import {CompactTrack} from "./compact-track";

export type CompactBeat = {
  readonly label: string;
  readonly genre: string;
  readonly bpm: number;
  readonly beatsPerBar: number;
  readonly subdivisionsPerBeat: number;
  readonly numberOfBar: number;
  readonly tracks: readonly CompactTrack[];
}
