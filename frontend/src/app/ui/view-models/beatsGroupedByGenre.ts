import {CompactBeat} from "../../infrastructure/adapters/secondary/beat-source/compact-beat";

export type BeatsGroupedByGenre = {
  readonly label: string;
  readonly beats: readonly CompactBeat[];
}
