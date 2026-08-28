import { Injectable } from "@angular/core";
import { NumberOfSteps } from "../../../domain/number-of-steps";
import { BPM } from "../../../domain/bpm";
import { Seconds } from "../../../domain/seconds";
import { StepIndex } from "../../../domain/step-index";

const numberOfSecondsInOneMinute = 60;

const NUMBER_OF_STEPS_MAP: ReadonlyMap<number, NumberOfSteps> =
  new Map<number, NumberOfSteps>([
    [8, NumberOfSteps.eight],
    [12, NumberOfSteps.twelve],
    [16, NumberOfSteps.sixteen],
    [24, NumberOfSteps.twenty_four],
    [32, NumberOfSteps.thirty_two],
    [48, NumberOfSteps.forty_eight],
    [64, NumberOfSteps.sixty_four]
  ]);

@Injectable({
  providedIn: "root"
})
export class TempoAdapterService {
  public bpm = BPM(128);
  public beatsPerBar = 4;
  public subdivisionsPerBeat = 4;
  public numberOfBar = 1;

  get numberOfSteps(): NumberOfSteps {
    const steps = NUMBER_OF_STEPS_MAP.get(
      this.beatsPerBar * this.subdivisionsPerBeat * this.numberOfBar
    );

    if (!steps) {
      throw new Error(
        `Unsupported step count: ${
          this.beatsPerBar * this.subdivisionsPerBeat * this.numberOfBar
        }`
      );
    }

    return steps;
  }

  get stepDuration(): Seconds {
    return Seconds(
      numberOfSecondsInOneMinute /
      this.bpm /
      this.subdivisionsPerBeat
    );
  }

  get barDuration(): Seconds {
    return Seconds(this.stepDuration * this.numberOfSteps);
  }

  getNextStepTime(baseTime: Seconds, stepIndex: StepIndex): number {
    const bar = Math.floor(baseTime / this.barDuration);

    return bar * this.barDuration + stepIndex * this.stepDuration;
  }
}