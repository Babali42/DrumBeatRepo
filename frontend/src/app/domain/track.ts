import { Steps } from "./steps";
import { NumberOfSteps } from "./number-of-steps";
import { MidiDrumType } from "./midi-drum-type";
import { Option } from "effect";
import { Mp3FilePath, toMp3FilePath } from "./filenames/mp3.filepath";
import { toWavFilePath, WavFilePath } from "./filenames/wav.filepath";
import { BeatsPerBar } from "./beatsPerBar";
import { SubdivisionsPerBeat } from "./subdivisionsPerBeat";


export class Track {
  readonly name: string;
  readonly fileName: Mp3FilePath | WavFilePath;
  readonly steps: Steps;
  readonly numberOfSteps: NumberOfSteps;
  readonly midiNote: Option.Option<MidiDrumType>;
  readonly beatsPerBar: BeatsPerBar;
  readonly subdivisionsPerBeat: SubdivisionsPerBeat;

  constructor(name: string, fileName: string, steps: readonly boolean[], midiNote: Option.Option<MidiDrumType> = Option.none(), beatsPerBar: number, subdivisionsPerBeat: number) {
    if (fileName.toLowerCase().endsWith('.mp3')) {
      this.fileName = toMp3FilePath(fileName);
    } else if (fileName.toLowerCase().endsWith('.wav')) {
      this.fileName = toWavFilePath(fileName);
    } else {
      throw new Error(`Unsupported audio format: ${fileName}`);
    }

    if (![8, 12, 16, 32, 64].includes(steps.length)) {
      throw new Error(`Step ${steps.length} is invalid`);
    }

    this.beatsPerBar = beatsPerBar as BeatsPerBar;
    this.subdivisionsPerBeat = subdivisionsPerBeat as SubdivisionsPerBeat;

    if (steps.length == 12) {
      this.subdivisionsPerBeat = 3;
    }

    this.name = name;

    this.steps = new Steps(steps);
    this.numberOfSteps = this.steps.steps.length;
    this.midiNote = midiNote;
  }
}
