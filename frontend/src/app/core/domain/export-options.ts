export type ExportFormat = 'mp3' | 'wav';
export type LoopCount = 1 | 2 | 4;
export type ExportQuality = 128 | 192 | 320;

export interface ExportOptions {
  format: ExportFormat;
  loopCount: LoopCount;
  quality: ExportQuality;
}

export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  format: 'mp3',
  loopCount: 1,
  quality: 192
};
