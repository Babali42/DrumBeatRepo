import { CompactBeatMapper } from "./compact-beat.mapper";
import { Effect } from "effect";
import { CompactBeat } from "./compact-beat";

describe('Compact beat mapper tests', () => {
  it("Should map compact beat to beat", async () => {
    const compactBeat: CompactBeat = {
      "label": "Metal",
      "genre": "Metal",
      "bpm": 180,
      "beatsPerBar": 4,
      "subdivisionsPerBeat": 4,
      "numberOfBar": 2,
      "tracks": [
        {
          "name": "Snare",
          "isMuted": true,
          "isSolo": true,
          "filename": "metal/snare.mp3",
          "steps": "____X_______X___"
        },
        {
          "name": "Hats",
          "filename": "metal/crash.mp3",
          "steps": "X___X___X___X___"
        },
        {
          "name": "Kick",
          "filename": "metal/kick.mp3",
          "steps": "XXXXXXXXXXXXXXXX"
        }
      ]
    };

    const beat = Effect.runSync(CompactBeatMapper.toBeatEffect(compactBeat));

    expect(beat.label).toEqual(compactBeat.label);
    expect(beat.genre).toEqual(compactBeat.genre);
    expect(beat.bpm.valueOf()).toEqual(Number(compactBeat.bpm));
    expect(beat.beatsPerBar).toEqual(compactBeat.beatsPerBar);
    expect(beat.subdivisionsPerBeat).toEqual(compactBeat.subdivisionsPerBeat);
    expect(beat.numberOfBar).toEqual(compactBeat.numberOfBar);
    expect(beat.tracks.length).toEqual(compactBeat.tracks.length);
    expect(beat.tracks[0].name).toEqual(compactBeat.tracks[0].name);
    expect(beat.tracks[0].isMuted).toBe(true);
    expect(beat.tracks[0].isSolo).toBe(true);
  });

  it("Should return Left when track format is incorrect", async () => {
    const invalidTrackResponse = {
      "label": "Invalid Beat",
      "genre": "Test",
      "bpm": 120,
      "beatsPerBar": 4,
      "subdivisionsPerBeat": 4,
      "numberOfBar": 1,
      "tracks": [
        {
          "name": "Track with invalid steps",
          "filename": "test/kick.wav",
          "steps": "X_X__",
          "isMuted": false
        }
      ]
    };

    expect(() => Effect.runSync(CompactBeatMapper.toBeatEffect(invalidTrackResponse))).toThrowError();
  });
});
