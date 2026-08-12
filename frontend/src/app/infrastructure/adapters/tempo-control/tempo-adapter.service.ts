import {Injectable} from "@angular/core";
import {NumberOfSteps} from "../../../domain/number-of-steps";
import {BPM} from "../../../domain/bpm";
import {Seconds} from "../../../domain/seconds";
import {StepIndex} from "../../../domain/step-index";
import { BeatsPerBar } from "src/app/domain/beatsPerBar";
import { SubdivisionsPerBeat } from "src/app/domain/subdivisionsPerBeat";
import { NumberOfBar } from "src/app/domain/numberOfBar";

const numberOfSecondsInOneMinute = 60;
const signature = 4;

@Injectable({
  providedIn: "root"
})
export class TempoAdapterService {
  public bpm = BPM(128);
  public numberOfSteps: NumberOfSteps = NumberOfSteps.sixteen;
  public beatsPerBar:BeatsPerBar = 4;
  public subdivisionsPerBeat: SubdivisionsPerBeat = 4;
  public numberOfBar: NumberOfBar = 1;

  setBpm(bpm: BPM) {
    this.bpm = bpm;
  }

  setBeatsPerBar(beatsPerBar: BeatsPerBar) {
    this.beatsPerBar = beatsPerBar;
    this.recalculateNumberOfSteps();
  }

  setSubdivisionsPerBeat(subdivisionsPerBeat: SubdivisionsPerBeat) {
    this.subdivisionsPerBeat = subdivisionsPerBeat;
    this.recalculateNumberOfSteps();
  }

  setNumberOfBar(numberOfBar: NumberOfBar) {
    this.numberOfBar = numberOfBar;
    this.recalculateNumberOfSteps();
  }

  private recalculateNumberOfSteps() {
    this.numberOfSteps = this.mapNumberOfSteps(this.beatsPerBar * this.subdivisionsPerBeat * this.numberOfBar);
  }

  private mapNumberOfSteps(product: number): NumberOfSteps {
    switch (product) {
      case 8:
        return NumberOfSteps.eight;
      case 12:
        return NumberOfSteps.twelve;
      case 16:
        return NumberOfSteps.sixteen;
      case 24:
        return NumberOfSteps.twenty_four;
      case 32:
        return NumberOfSteps.thirty_two;
      case 48:
        return NumberOfSteps.forty_eight;
      case 64:
        return NumberOfSteps.sixty_four;
      default:
        throw new Error(`Unsupported number of steps: ${product}`);
    }
  }

  get stepDuration(): Seconds {
    return Seconds(numberOfSecondsInOneMinute / this.bpm / signature);
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
