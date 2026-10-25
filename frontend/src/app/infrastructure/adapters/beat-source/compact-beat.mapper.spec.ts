import { CompactBeatMapper } from "./compact-beat.mapper";
import { Beat } from "../../../domain/beat";
import { Track } from "../../../domain/track";
import { BPM } from "../../../domain/bpm";
import { Effect, Option } from "effect";
import { toMp3FilePath } from "../../../domain/filenames/mp3.filepath";
import { MidiDrumType } from "../../../domain/midi-drum-type";
import { CompactBeat } from "./compact-beat";

describe('Compact beat mapper tests', () => {
  it("Should map beat to compact beat to beat again", () => {
    const beat: Beat = {
      genre: "test", label: "", bpm: BPM(150), beatsPerBar: 8, subdivisionsPerBeat: 3, numberOfBar: 2, tracks: [
        new Track("", toMp3FilePath("test.mp3"), [true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true], false, false, Option.some(MidiDrumType.ACOUSTIC_BASS_DRUM)),
        new Track("", toMp3FilePath("test.mp3"), [true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true], false, false, Option.some(MidiDrumType.ACOUSTIC_BASS_DRUM)),
      ]
    };

    const compactBeat = toCompactBeat(beat);
    const mappedBeat = Effect.runSync(CompactBeatMapper.toBeatEffect(compactBeat));

    expect(mappedBeat.label).toEqual(beat.label);
    expect(mappedBeat.genre).toEqual(beat.genre);
    expect(mappedBeat.bpm).toEqual(beat.bpm);
    expect(mappedBeat.beatsPerBar).toEqual(beat.beatsPerBar);
    expect(mappedBeat.subdivisionsPerBeat).toEqual(beat.subdivisionsPerBeat);
    expect(mappedBeat.numberOfBar).toEqual(beat.numberOfBar);
    expect(mappedBeat.tracks.length).toEqual(beat.tracks.length);
    expect(mappedBeat.tracks[0].name).toEqual(beat.tracks[0].name);
    expect(mappedBeat.tracks[0].steps.getStepAtIndex(0)).toEqual(beat.tracks[0].steps.getStepAtIndex(0));
    expect(mappedBeat.tracks[0].steps.getStepAtIndex(3)).toEqual(beat.tracks[0].steps.getStepAtIndex(3));
    expect(mappedBeat.tracks[0].isMuted).toEqual(beat.tracks[0].isMuted);
    expect(mappedBeat.tracks[0].isSolo).toEqual(beat.tracks[0].isSolo);
  });

  it("Should map compact beat to beat", async () => {
    const compactBeat: any = {
      "label": "Metal",
      "genre": "Metal",
      "bpm": "180",
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

function toCompactBeat(beat: Beat): CompactBeat {
  return {
    label: beat.label,
    genre: beat.genre,
    bpm: beat.bpm,
    beatsPerBar: beat.beatsPerBar,
    subdivisionsPerBeat: beat.subdivisionsPerBeat,
    numberOfBar: beat.numberOfBar,
    tracks: beat.tracks.map(track => ({
      name: track.name,
      filename: track.filename,
      steps: track.steps.steps.map(x => x ? "X" : " ").join(''),
      isMuted: track.isMuted,
      isSolo: track.isSolo,
      midiNote: Option.isNone(track.midiNote) ? undefined : track.midiNote.value
    }))
  }
}