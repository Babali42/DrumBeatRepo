import {CompactTrack} from "./compact-track";

export type CompactBeat = {
  readonly id: string;
  readonly label: string;
  readonly bpm: number;
  readonly genre: string;
  readonly tracks: readonly CompactTrack[];
}
