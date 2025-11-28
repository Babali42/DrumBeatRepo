import { Track } from "./track";
import {Bpm} from "./bpm";

export type Beat = {
  readonly id: string;
  readonly label: string;
  readonly bpm: Bpm;
  readonly tracks: ReadonlyArray<Track>;
}
