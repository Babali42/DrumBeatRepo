export class AudioFilesService {
  async getAudioBuffer(soundName: string): Promise<AudioBuffer> {
    const myRequest = new Request(`assets/sounds/${soundName}`);
    const response = await fetch(myRequest);
    const arrayBuffer = await response.arrayBuffer();
    return await new AudioContext().decodeAudioData(arrayBuffer).then((data) => {
      return data
    });
  }
}
