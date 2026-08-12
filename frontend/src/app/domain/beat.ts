import { Track } from "./track";
import {BPM} from "./bpm";
import { BeatsPerBar } from "./beatsPerBar";
import { SubdivisionsPerBeat } from "./subdivisionsPerBeat";
import { NumberOfBar } from "./numberOfBar";

export type Beat = {
  readonly label: string;
  readonly genre: string;
  readonly bpm: BPM;
  readonly beatsPerBar: BeatsPerBar;
  readonly subdivisionsPerBeat: SubdivisionsPerBeat;
  readonly numberOfBar: NumberOfBar;
  readonly tracks: ReadonlyArray<Track>;
}
