import {Steps} from "./steps";
import {NumberOfSteps} from "./number-of-steps";
import {MidiDrumType} from "./midi-drum-type";
import {Option} from "effect";

const allowedStepLengths = [8, 16, 32, 64];

export class Track {
  readonly name: string;
  readonly fileName: string;
  readonly steps: Steps;
  readonly numberOfSteps: NumberOfSteps;
  readonly midiNote: Option.Option<MidiDrumType>;

  constructor(name: string, fileName: string, steps: boolean[], midiNote: Option.Option<MidiDrumType> = Option.none()) {
    this.fileName = fileName;
    this.name = name;

    if(!allowedStepLengths.includes(steps.length)) {
      throw new Error(`Step ${steps.length} is invalid`);
    }

    this.steps = new Steps(steps);
    this.numberOfSteps = this.steps.steps.length;
    this.midiNote = midiNote;
  }
}
