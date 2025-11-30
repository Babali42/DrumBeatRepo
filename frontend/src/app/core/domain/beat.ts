import { Track } from "./track";
import {Bpm} from "./bpm";

export type Beat = {
  readonly label: string;
  readonly genre: string;
  readonly bpm: Bpm;
  readonly tracks: ReadonlyArray<Track>;
}
