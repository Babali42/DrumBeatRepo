import { Track } from "src/app/domain/track";
import { BPM } from "../../../domain/bpm";

export class SequencerViewModel {
  genre: string = "Techno";
  beat: string = "4 on the floor";
  tracks: Track[] = [];
  tempo: BPM = BPM(129);
  historyLength: number = 0;
  futureLength: number = 0;
}
