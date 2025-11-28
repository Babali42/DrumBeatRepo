import {CompactBeat} from "../../core/adapters/secondary/compact-beat";

export type BeatsGroupedByGenre = {
  readonly label: string;
  readonly beats: readonly CompactBeat[];
}
