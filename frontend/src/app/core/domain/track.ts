import {Steps} from "./steps";
import {NumberOfSteps} from "./numberOfSteps";
import {MidiDrumType} from "./midi-drum-type";

const allowedStepLengths = [8, 16, 32, 64];

export class Track {
  readonly name: string;
  readonly fileName: string;
  readonly steps: Steps;
  readonly numberOfSteps: NumberOfSteps;
  readonly midiNote: MidiDrumType;

  constructor(name: string, fileName: string, steps: boolean[], midiNote: MidiDrumType = MidiDrumType.ACOUSTIC_BASS_DRUM) {
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
