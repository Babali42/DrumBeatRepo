import {Bpm} from "../../../../core/domain/bpm";
import {Injectable} from "@angular/core";
import {TrackSignature} from "../../../../core/domain/trackSignature";

const map : Record<TrackSignature, number> = {
  "64": 16,
  "32": 8,
  "16": 4,
  "8": 2,
}

@Injectable({
  providedIn: "root"
})
export class TempoAdapterService {
  public bpm: Bpm = new Bpm(128);
  public signature: TrackSignature = TrackSignature.sixteen;
  public beatsPerBar: number = 4;

  setBpm(bpm: Bpm) {
    this.bpm = bpm;
  }

  setSignature(signature: TrackSignature) {
    this.signature = signature;
    this.beatsPerBar = map[signature];
  }

  get stepDuration(): number {
    return this.barDuration / this.signature;
  }

  get barDuration(): number {
    return (60 / this.bpm.value) * this.beatsPerBar;
  }

  /** Pure math: given a time offset in seconds, where does a step fall? */
  getNextStepTime(baseTime: number, stepIndex: number): number {
    const bar = Math.floor(baseTime / this.barDuration);
    return bar * this.barDuration + stepIndex * this.stepDuration;
  }
}
