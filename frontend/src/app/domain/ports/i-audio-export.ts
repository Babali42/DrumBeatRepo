import {Track} from "../track";
import {AudioExportOptions} from "../export-options/audio-export-options";

export interface IAudioExport {
  exportBeat(tracks: readonly Track[], options: AudioExportOptions): Promise<Blob>
}
