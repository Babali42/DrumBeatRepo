import {CompactBeatMapper} from "./compact-beat.mapper";
import {Beat} from "../../../../core/domain/beat";
import {Track} from "../../../../core/domain/track";
import {BPM} from "../../../../core/domain/bpm";
import {Effect} from "effect";

describe('Compact beat mapper tests', () => {
  it("Should map beat to compact beat to beat again", () => {
    const beat : Beat = {
      genre: "test", label: "", bpm: BPM(150), tracks: [
        new Track("", "", [true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true]),
        new Track("", "", [true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true]),
      ]
    };

    const compactBeat = CompactBeatMapper.toCompactBeat(beat);
    const result = Effect.runSync(Effect.either(CompactBeatMapper.toBeatEffect(compactBeat)));

    expect(result._tag).toBe('Right');
    const mappedBeat = (result as any).right;

    expect(mappedBeat.label).toEqual(beat.label);
    expect(mappedBeat.genre).toEqual(beat.genre);
    expect(mappedBeat.bpm).toEqual(beat.bpm);
    expect(mappedBeat.tracks.length).toEqual(beat.tracks.length);
    expect(mappedBeat.tracks[0].name).toEqual(beat.tracks[0].name);
    expect(mappedBeat.tracks[0].steps.getStepAtIndex(0)).toEqual(beat.tracks[0].steps.getStepAtIndex(0));
    expect(mappedBeat.tracks[0].steps.getStepAtIndex(3)).toEqual(beat.tracks[0].steps.getStepAtIndex(3));
  });

  it("Should map compact beat to beat", async () => {
    // @ts-ignore
    const compactBeat: any = {
      "label": "Metal",
      "genre": "Metal",
      "bpm": "180",
      "tracks": [
        {
          "name": "Snare",
          "fileName": "metal/snare.mp3",
          "steps": "____X_______X___"
        },
        {
          "name": "Hats",
          "fileName": "metal/crash.mp3",
          "steps": "X___X___X___X___"
        },
        {
          "name": "Kick",
          "fileName": "metal/kick.mp3",
          "steps": "XXXXXXXXXXXXXXXX"
        }
      ]
    };

    const result = await Effect.runPromise(Effect.either(CompactBeatMapper.toBeatEffect(compactBeat)));

    expect(result._tag).toBe('Right');
    const beat = (result as any).right as Beat;

    expect(beat.label).toEqual(compactBeat.label);
    expect(beat.genre).toEqual(compactBeat.genre);
    expect(beat.bpm.valueOf()).toEqual(Number(compactBeat.bpm));
    expect(beat.tracks.length).toEqual(compactBeat.tracks.length);
    expect(beat.tracks[0].name).toEqual(compactBeat.tracks[0].name);
  });

  it("Should return Left when track format is incorrect", async () => {
    const invalidTrackResponse = {
      "label": "Invalid Beat",
      "genre": "Test",
      "bpm": 120,
      "tracks": [
        {
          "name": "Track with invalid steps",
          "fileName": "test/kick.wav",
          "steps": "X_X__"
        }
      ]
    };

    const result = await Effect.runPromise(Effect.either(CompactBeatMapper.toBeatEffect(invalidTrackResponse)));
    expect(result._tag).toBe('Left');
  });
});
