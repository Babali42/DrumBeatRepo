import {Steps} from "./steps";
import {TrackSignature} from "./trackSignature";

const allowedStepLengths = [8, 16, 32, 64];

export class Track {
  readonly name: string;
  readonly fileName: string;
  readonly steps: Steps;
  readonly signature: TrackSignature;

  constructor(name: string, fileName: string, steps: boolean[]) {
    this.fileName = fileName;
    this.name = name;

    if(!allowedStepLengths.includes(steps.length)) {
      throw new Error(`Step ${steps.length} is invalid`);
    }

    this.steps = new Steps(steps);
    this.signature = this.steps.steps.length;
  }
}
