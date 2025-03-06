import { Track } from "./track";

export type Beat = {
  readonly id: string;
  readonly label: string;
  readonly bpm: number;
  readonly genre: string;
  readonly tracks: ReadonlyArray<Track>;
}
