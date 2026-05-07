export type MidiFilename = `${string}${string}.mid`;

export function toMidiFilename(name: string): MidiFilename {
  if (!/^[^.\s][^\\/:*?"<>|]*\.mid$/i.test(name)) {
    throw new Error('Invalid MIDI filename');
  }
  return name as MidiFilename;
}
