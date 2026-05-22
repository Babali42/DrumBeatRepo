export type ExportFormat = 'mp3' | 'wav';
export type LoopCount = 1 | 2 | 4;
export type ExportQuality = 128 | 192 | 320;

export interface AudioExportOptions {
  format: ExportFormat;
  loopCount: LoopCount;
  quality: ExportQuality;
}

export const DEFAULT_EXPORT_OPTIONS: AudioExportOptions = {
  format: 'wav',
  loopCount: 1,
  quality: 192
};
