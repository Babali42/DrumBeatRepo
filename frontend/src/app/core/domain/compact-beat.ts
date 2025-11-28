import {CompactTrack} from "./compact-track";

export type CompactBeat = {
  readonly id: string;
  readonly label: string;
  readonly bpm: number;
  readonly tracks: readonly CompactTrack[];
}
