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
  readonly filename: Mp3FilePath | WavFilePath;
  readonly steps: Steps;
  readonly numberOfSteps: NumberOfSteps;
  readonly midiNote: Option.Option<MidiDrumType>;
  readonly beatsPerBar: BeatsPerBar = 4;
  readonly subdivisionsPerBeat: SubdivisionsPerBeat = 4;
  readonly isMuted: boolean;

  constructor(name: string, filename: string, steps: readonly boolean[], isMuted: boolean, midiNote: Option.Option<MidiDrumType> = Option.none(), beatsPerBar: number = 4, subdivisionsPerBeat: number = 4) {
    if (filename.toLowerCase().endsWith('.mp3')) {
      this.filename = toMp3FilePath(filename);
    } else if (filename.toLowerCase().endsWith('.wav')) {
      this.filename = toWavFilePath(filename);
    } else {
      throw new Error(`Unsupported audio format: ${filename}`);
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
    this.isMuted = isMuted;
  }
}
