import {CompactBeatMapper} from "./compact-beat.mapper";
import {Beat} from "../../../../core/domain/beat";
import {Track} from "../../../../core/domain/track";
import {BPM} from "../../../../core/domain/bpm";

describe('Compact beat mapper tests', () => {
  it("Should map beat to compact beat to beat again", () => {
    const beat : Beat = {
      genre: "test", label: "", bpm: BPM(150), tracks: [
        new Track("", "", [true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true]),
        new Track("", "", [true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true]),
      ]
    };

    const compactBeat = CompactBeatMapper.toCompactBeat(beat);
    const result = CompactBeatMapper.toBeat(compactBeat);

    expect(result.label).toEqual(beat.label);
    expect(result.genre).toEqual(beat.genre);
    expect(result.bpm).toEqual(beat.bpm);
    expect(result.tracks.length).toEqual(beat.tracks.length);
    expect(result.tracks[0].name).toEqual(beat.tracks[0].name);
    expect(result.tracks[0].steps.getStepAtIndex(0)).toEqual(beat.tracks[0].steps.getStepAtIndex(0));
    expect(result.tracks[0].steps.getStepAtIndex(3)).toEqual(beat.tracks[0].steps.getStepAtIndex(3));
  });

  it("Should map compact beat to beat", () => {
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

    const result = CompactBeatMapper.toBeat(compactBeat);

    expect(result.label).toEqual(compactBeat.label);
    expect(result.genre).toEqual(compactBeat.genre);
    expect(result.bpm.valueOf()).toEqual(Number(compactBeat.bpm));
    expect(result.tracks.length).toEqual(compactBeat.tracks.length);
    expect(result.tracks[0].name).toEqual(compactBeat.tracks[0].name);
  });
});
