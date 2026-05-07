import {MidiExportOptions} from "../midi-export-options";
import {Beat} from "../beat";

export interface IMidi {
  exportBeat(beat: Beat, options: MidiExportOptions): Promise<Blob>;
}
