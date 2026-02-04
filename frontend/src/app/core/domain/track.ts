import {Steps} from "./steps";
import {NumberOfSteps} from "./numberOfSteps";

const allowedStepLengths = [8, 16, 32, 64];

export class Track {
  readonly name: string;
  readonly fileName: string;
  readonly steps: Steps;
  readonly numberOfSteps: NumberOfSteps;

  constructor(name: string, fileName: string, steps: boolean[]) {
    this.fileName = fileName;
    this.name = name;

    if(!allowedStepLengths.includes(steps.length)) {
      throw new Error(`Step ${steps.length} is invalid`);
    }

    this.steps = new Steps(steps);
    this.numberOfSteps = this.steps.steps.length;
  }
}
