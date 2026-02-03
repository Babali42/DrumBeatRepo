import { AudioFilesService } from './audio-files.service';
import {Option} from "effect";

describe('AudioFilesService', () => {
  let service: AudioFilesService;
  let decodeAudioDataMock: jest.Mock;

  beforeEach(() => {
    service = new AudioFilesService();

    // Mock global fetch
    (globalThis as any).fetch = jest.fn();

    // Mock AudioContext
    decodeAudioDataMock = jest.fn();
    (globalThis as any).AudioContext = jest.fn().mockImplementation(() => ({
      decodeAudioData: decodeAudioDataMock,
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns Some(AudioBuffer) when fetch and decode succeed', async () => {
    const fakeArrayBuffer = new ArrayBuffer(8);
    const fakeAudioBuffer = {} as AudioBuffer;

    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      arrayBuffer: jest.fn().mockResolvedValue(fakeArrayBuffer),
    });

    decodeAudioDataMock.mockResolvedValue(fakeAudioBuffer);

    const result = await service.getAudioBuffer('sound.wav');

    expect(result._tag).toBe('Some');
    expect(Option.getOrThrow(result)).toBe(fakeAudioBuffer);
    expect(globalThis.fetch).toHaveBeenCalledWith('assets/sounds/sound.wav');
    expect(decodeAudioDataMock).toHaveBeenCalledWith(fakeArrayBuffer);
  });

  it('returns None when fetch fails (network error)', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValue(new Error('Network fail'));

    const result = await service.getAudioBuffer('sound.wav');

    expect(result._tag).toBe('None');
  });

  it('returns None when response is not ok (404)', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({ ok: false });

    const result = await service.getAudioBuffer('missing.wav');

    expect(result._tag).toBe('None');
  });

  it('returns None when decodeAudioData throws', async () => {
    const fakeArrayBuffer = new ArrayBuffer(8);

    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      arrayBuffer: jest.fn().mockResolvedValue(fakeArrayBuffer),
    });

    decodeAudioDataMock.mockRejectedValue(new Error('Decode fail'));

    const result = await service.getAudioBuffer('bad.wav');

    expect(result._tag).toBe('None');
  });
});
