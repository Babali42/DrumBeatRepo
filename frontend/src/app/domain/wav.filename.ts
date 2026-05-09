export type WavFilename = `${string}.wav`;

export type WavFilePath = `${string}/${WavFilename}` | WavFilename;

export function toWavFilePath(path: string): WavFilePath {
  if (!/^(.*\/)?[^\/]+\.wav$/i.test(path.trim())) {
    throw new Error(`Invalid mp3 file path: ${path}`);
  }

  return path as WavFilePath;
}
