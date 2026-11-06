import { Track } from "src/app/domain/track";
import { BPM } from "../../../domain/time/bpm";

export class SequencerViewModel {
  genre: string = "Techno";
  beats: readonly string[] = [];
  beat: string = "4 on the floor";
  tracks: readonly Track[] = [];
  tempo: BPM = BPM(129);
  beatsPerBar: number = 4;
  subdivisionsPerBeat: number | undefined;
  numberOfBar: number = 1;
  historyLength: number = 0;
  futureLength: number = 0;
}
