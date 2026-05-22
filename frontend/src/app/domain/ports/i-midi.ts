import {MidiExportOptions} from "../export-options/midi-export-options";
import {Beat} from "../beat";

export interface IMidi {
  exportBeat(beat: Beat, options: MidiExportOptions): Promise<Blob>;
}
