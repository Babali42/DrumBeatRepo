import {toWavFilename, WavFilename} from "../filenames/wav.filepath";

export type LoopCount = 1 | 2 | 4;

export interface AudioExportOptions {
  readonly filename: WavFilename;
  readonly loopCount: LoopCount;
  readonly exportWithTail: boolean;
}

export const DEFAULT_EXPORT_OPTIONS: AudioExportOptions = {
  filename: toWavFilename('file.wav'),
  loopCount: 1,
  exportWithTail: true
};
