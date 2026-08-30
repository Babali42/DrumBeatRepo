import { Track } from "./track";
import { BPM } from "./bpm";

export type Beat = {
  readonly label: string;
  readonly genre: string;
  readonly bpm: BPM;
  readonly beatsPerBar: number;
  readonly subdivisionsPerBeat: number;
  readonly numberOfBar: number;
  readonly tracks: ReadonlyArray<Track>;
}
