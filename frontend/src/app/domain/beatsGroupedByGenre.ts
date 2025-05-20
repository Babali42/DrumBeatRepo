import {CompactBeat} from "../adapters/secondary/compact-beat";

export type BeatsGroupedByGenre = {
  readonly label: string;
  readonly beats: CompactBeat[];
}
