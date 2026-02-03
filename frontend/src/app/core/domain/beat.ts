import { Track } from "./track";
import {BPM} from "./bpm";

export type Beat = {
  readonly label: string;
  readonly genre: string;
  readonly bpm: BPM;
  readonly tracks: ReadonlyArray<Track>;
}
