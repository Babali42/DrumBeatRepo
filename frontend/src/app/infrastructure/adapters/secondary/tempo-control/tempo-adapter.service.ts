import {Injectable} from "@angular/core";
import {TrackSignature} from "../../../../core/domain/trackSignature";
import {BPM} from "../../../../core/domain/bpm";
import {Seconds} from "../../../../core/domain/seconds";
import {StepIndex} from "../../../../core/domain/step-index";

@Injectable({
  providedIn: "root"
})
export class TempoAdapterService {
  public bpm = BPM(128);
  public signature: TrackSignature = TrackSignature.sixteen;
  public beatsPerBar: number = 4;

  setBpm(bpm: BPM) {
    this.bpm = bpm;
  }

  setSignature(signature: TrackSignature) {
    this.signature = signature;
    this.beatsPerBar = signature / 4;
  }

  get stepDuration(): Seconds {
    return Seconds(this.barDuration / this.signature);
  }

  get barDuration(): Seconds {
    return Seconds((60 / this.bpm) * this.beatsPerBar);
  }

  /** Pure math: given a time offset in seconds, where does a step fall? */
  getNextStepTime(baseTime: Seconds, stepIndex: StepIndex): number {
    const bar = Math.floor(baseTime / this.barDuration);
    return bar * this.barDuration + stepIndex * this.stepDuration;
  }
}
