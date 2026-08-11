import { CompactBeatMapper } from "./compact-beat.mapper";
import { Beat } from "../../../domain/beat";
import { Track } from "../../../domain/track";
import { BPM } from "../../../domain/bpm";
import { Effect, Option } from "effect";
import { toMp3FilePath } from "../../../domain/filenames/mp3.filepath";
import { MidiDrumType } from "../../../domain/midi-drum-type";

describe('Compact beat mapper tests', () => {
  it("Should map beat to compact beat to beat again", () => {
    const beat: Beat = {
      genre: "test", label: "", bpm: BPM(150), tracks: [
        new Track("", toMp3FilePath("test.mp3"), [true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true], false, Option.some(MidiDrumType.ACOUSTIC_BASS_DRUM), 8, 3),
        new Track("", toMp3FilePath("test.mp3"), [true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true], false, Option.some(MidiDrumType.ACOUSTIC_BASS_DRUM), 8, 3),
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
    expect(mappedBeat.tracks[0].beatsPerBar).toEqual(beat.tracks[0].beatsPerBar);
    expect(mappedBeat.tracks[0].subdivisionsPerBeat).toEqual(beat.tracks[0].subdivisionsPerBeat);
    expect(mappedBeat.tracks[0].steps.getStepAtIndex(0)).toEqual(beat.tracks[0].steps.getStepAtIndex(0));
    expect(mappedBeat.tracks[0].steps.getStepAtIndex(3)).toEqual(beat.tracks[0].steps.getStepAtIndex(3));
    expect(mappedBeat.tracks[0].isMuted).toEqual(beat.tracks[0].isMuted);
  });

  it("Should map compact beat to beat", async () => {
    const compactBeat: any = {
      "label": "Metal",
      "genre": "Metal",
      "bpm": "180",
      "tracks": [
        {
          "name": "Snare",
          "filename": "metal/snare.mp3",
          "steps": "____X_______X___",
          "beatsPerBar": 4,
          "subdivisionsPerBeat": 4
        },
        {
          "name": "Hats",
          "filename": "metal/crash.mp3",
          "steps": "X___X___X___X___",
          "beatsPerBar": 4,
          "subdivisionsPerBeat": 4
        },
        {
          "name": "Kick",
          "filename": "metal/kick.mp3",
          "steps": "XXXXXXXXXXXXXXXX",
          "beatsPerBar": 4,
          "subdivisionsPerBeat": 4
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
    expect(beat.tracks[0].isMuted).toBe(false);
  });

  it("Should return Left when track format is incorrect", async () => {
    const invalidTrackResponse = {
      "label": "Invalid Beat",
      "genre": "Test",
      "bpm": 120,
      "tracks": [
        {
          "name": "Track with invalid steps",
          "filename": "test/kick.wav",
          "steps": "X_X__",
          "isMuted": false,
          "beatsPerBar": 4,
          "subdivisionsPerBeat": 4
        }
      ]
    };

    const result = await Effect.runPromise(Effect.either(CompactBeatMapper.toBeatEffect(invalidTrackResponse)));
    expect(result._tag).toBe('Left');
  });
});
