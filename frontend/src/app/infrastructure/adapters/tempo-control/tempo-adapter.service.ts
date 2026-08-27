import { Injectable } from "@angular/core";
import { NumberOfSteps } from "../../../domain/number-of-steps";
import { BPM } from "../../../domain/bpm";
import { Seconds } from "../../../domain/seconds";
import { StepIndex } from "../../../domain/step-index";

const numberOfSecondsInOneMinute = 60;

@Injectable({
  providedIn: "root"
})
export class TempoAdapterService {
  public bpm = BPM(128);
  public numberOfSteps = 16;
  public beatsPerBar = 4;
  public subdivisionsPerBeat = 4;
  public numberOfBar = 1;

  setBpm(bpm: BPM) {
    this.bpm = bpm;
  }

  setBeatsPerBar(beatsPerBar: number) {
    this.beatsPerBar = beatsPerBar;
    this.recalculateNumberOfSteps();
  }

  setSubdivisionsPerBeat(subdivisionsPerBeat: number) {
    this.subdivisionsPerBeat = subdivisionsPerBeat;
    this.recalculateNumberOfSteps();
  }

  setNumberOfBar(numberOfBar: number) {
    this.numberOfBar = numberOfBar;
    this.recalculateNumberOfSteps();
  }

  private recalculateNumberOfSteps() {
    if (Number.isNaN(this.subdivisionsPerBeat))
      throw new Error(`subdivisionsPerBeat is NaN`);

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
    return Seconds(numberOfSecondsInOneMinute / this.bpm / this.subdivisionsPerBeat);
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
