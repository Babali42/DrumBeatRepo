import { Track } from "./track";
import {BPM} from "./bpm";
import { BeatsPerBar } from "./beats-per-bar";
import { SubdivisionsPerBeat } from "./subdivisions-per-beat";
import { NumberOfBar } from "./number-of-bar";

export type Beat = {
  readonly label: string;
  readonly genre: string;
  readonly bpm: BPM;
  readonly beatsPerBar: BeatsPerBar;
  readonly subdivisionsPerBeat: SubdivisionsPerBeat;
  readonly numberOfBar: NumberOfBar;
  readonly tracks: ReadonlyArray<Track>;
}
