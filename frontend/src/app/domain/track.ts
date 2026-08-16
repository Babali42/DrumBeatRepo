import { Steps } from "./steps";
import { MidiDrumType } from "./midi-drum-type";
import { Option } from "effect";
import { Mp3FilePath, toMp3FilePath } from "./filenames/mp3.filepath";
import { toWavFilePath, WavFilePath } from "./filenames/wav.filepath";


export class Track {
  readonly name: string;
  readonly filename: Mp3FilePath | WavFilePath;
  readonly steps: Steps;
  readonly midiNote: Option.Option<MidiDrumType>;
  readonly isMuted: boolean;

  constructor(name: string, filename: string, steps: readonly boolean[], isMuted: boolean, midiNote: Option.Option<MidiDrumType> = Option.none()) {
    if (filename.toLowerCase().endsWith('.mp3')) {
      this.filename = toMp3FilePath(filename);
    } else if (filename.toLowerCase().endsWith('.wav')) {
      this.filename = toWavFilePath(filename);
    } else {
      throw new Error(`Unsupported audio format: ${filename}`);
    }

    if (![4, 8, 12, 16, 32, 64].includes(steps.length)) {
      throw new Error(`Step ${steps.length} is invalid`);
    }

    this.name = name;

    this.steps = new Steps(steps);
    this.midiNote = midiNote;
    this.isMuted = isMuted;
  }
}
