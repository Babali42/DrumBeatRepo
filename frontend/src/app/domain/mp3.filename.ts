export type Mp3Filename = `${string}.mp3`;

export type Mp3FilePath = `${string}/${Mp3Filename}` | Mp3Filename;

export function toMp3FilePath(path: string): Mp3FilePath {
  if (!/^(.*\/)?[^\/]+\.mp3$/i.test(path.trim())) {
    throw new Error(`Invalid mp3 file path: ${path}`);
  }

  return path as Mp3FilePath;
}
