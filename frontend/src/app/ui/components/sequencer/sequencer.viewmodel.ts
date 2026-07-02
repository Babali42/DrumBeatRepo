import {BPM} from "../../../domain/bpm";

export class SequencerViewModel {
  tempo: BPM = BPM(129)
  genre: string = "Techno"
  beat: string = "4 on the floor"
  historyLength: number = 0;
  futureLength: number = 0;
}
