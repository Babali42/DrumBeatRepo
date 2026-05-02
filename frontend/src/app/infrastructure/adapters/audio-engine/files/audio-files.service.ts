import {Option} from "effect";

export class AudioFilesService {
  constructor(
    private readonly fetchFn: typeof fetch = fetch,
    private readonly createAudioContext: () => AudioContext = () => new AudioContext(),
  ) {}

  async getAudioBuffer(soundName: string): Promise<Option.Option<AudioBuffer>> {
    try {
      const response = await this.fetchFn(`assets/sounds/${soundName}`);
      if (!response.ok) return Option.none();

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.createAudioContext().decodeAudioData(arrayBuffer);

      return Option.some(audioBuffer);
    } catch {
      return Option.none();
    }
  }
}
