import {Injectable} from "@angular/core";
import {NumberOfSteps} from "../../../../core/domain/numberOfSteps";
import {BPM} from "../../../../core/domain/bpm";
import {Seconds} from "../../../../core/domain/seconds";
import {StepIndex} from "../../../../core/domain/step-index";

const numberOfSecondsInOneMinute = 60;
const signature = 4;

@Injectable({
  providedIn: "root"
})
export class TempoAdapterService {
  public bpm = BPM(128);
  public numberOfSteps: NumberOfSteps = NumberOfSteps.sixteen;

  setBpm(bpm: BPM) {
    this.bpm = bpm;
  }

  setNumberOfSteps(numberOfSteps: NumberOfSteps) {
    this.numberOfSteps = numberOfSteps;
  }

  get stepDuration(): Seconds {
    return Seconds((numberOfSecondsInOneMinute / this.bpm) / signature);
  }

  get barDuration(): Seconds {
    return Seconds(this.stepDuration * this.numberOfSteps);
  }

  /** Pure math: given a time offset in seconds, where does a step fall? */
  getNextStepTime(baseTime: Seconds, stepIndex: StepIndex): number {
    const bar = Math.floor(baseTime / this.barDuration);
    return bar * this.barDuration + stepIndex * this.stepDuration;
  }
}
