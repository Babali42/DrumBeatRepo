import {Option} from "effect";

export class AudioFilesService {
  async getAudioBuffer(soundName: string): Promise<Option.Option<AudioBuffer>> {
    try {
      const response = await fetch(`assets/sounds/${soundName}`);

      if (!response.ok)
        return Option.none();

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await new AudioContext().decodeAudioData(arrayBuffer);

      return Option.some(audioBuffer);
    } catch {
      return Option.none();
    }
  }
}
