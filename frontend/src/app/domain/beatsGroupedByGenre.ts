import {CompactBeat} from "./compact-beat";

export type BeatsGroupedByGenre = {
  readonly label: string;
  readonly beats: readonly CompactBeat[];
}
