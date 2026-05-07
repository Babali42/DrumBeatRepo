import {Track} from "../track";
import {ExportOptions} from "../export-options";

export interface IAudioExport {
  exportBeat(tracks: readonly Track[], options: ExportOptions): Promise<Blob>
}
