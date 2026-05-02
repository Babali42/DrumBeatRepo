import { vi } from "vitest";
import {AudioFilesService} from "./audio-files.service";
import {Option} from "effect";

describe('AudioFilesService', () => {
  it('returns Some(AudioBuffer) when fetch and decode succeed', async () => {
    const fakeArrayBuffer = new ArrayBuffer(8);
    const fakeAudioBuffer = {} as AudioBuffer;

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: vi.fn().mockResolvedValue(fakeArrayBuffer),
    });
    const decodeAudioDataMock = vi.fn().mockResolvedValue(fakeAudioBuffer);
    const createAudioContext = vi.fn().mockReturnValue({
      decodeAudioData: decodeAudioDataMock,
    });

    const service = new AudioFilesService(fetchMock, createAudioContext);
    const result = await service.getAudioBuffer('sound.wav');

    expect(Option.getOrThrow(result)).toBe(fakeAudioBuffer);
    expect(fetchMock).toHaveBeenCalledWith('assets/sounds/sound.wav');
    expect(decodeAudioDataMock).toHaveBeenCalledWith(fakeArrayBuffer);
  });

  it('returns None when response is not ok (404)', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    const service = new AudioFilesService(fetchMock, vi.fn());

    const result = await service.getAudioBuffer('missing.wav');

    expect(result._tag).toBe('None');
  });

  it('returns None when decodeAudioData throws', async () => {
    const fakeArrayBuffer = new ArrayBuffer(8);

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: vi.fn().mockResolvedValue(fakeArrayBuffer),
    });
    const decodeAudioDataMock = vi.fn().mockRejectedValue(new Error('Decode fail'));
    const service = new AudioFilesService(fetchMock, vi.fn().mockReturnValue({
      decodeAudioData: decodeAudioDataMock,
    }));

    const result = await service.getAudioBuffer('bad.wav');

    expect(result._tag).toBe('None');
  });
});
