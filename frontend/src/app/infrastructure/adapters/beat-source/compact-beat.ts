import {CompactTrack} from "./compact-track";

export type CompactBeat = {
  readonly label: string;
  readonly genre: string;
  readonly bpm: number;
  readonly tracks: readonly CompactTrack[];
}
