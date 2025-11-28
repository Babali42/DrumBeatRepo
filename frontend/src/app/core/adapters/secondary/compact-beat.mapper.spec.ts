import {CompactBeatMapper} from "./compact-beat.mapper";
import {Beat} from "../../domain/beat";
import {Track} from "../../domain/track";
import {Bpm} from "../../domain/bpm";

describe('Compact beat mapper tests', () => {
  it("Should map compact beat to url to compact beat", () => {
    const beat = {
      id: "", genre: "", label: "", bpm: new Bpm(150), tracks: [
        new Track("", "", [true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true]),
        new Track("", "", [true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true]),
      ]
    } as Beat;

    const compactBeat = CompactBeatMapper.toCompactBeat(beat);
    const result = CompactBeatMapper.toBeat(compactBeat);

    expect(result.label).toEqual(beat.label);
    expect(result.bpm).toEqual(beat.bpm);
    expect(result.tracks.length).toEqual(beat.tracks.length);
    expect(result.tracks[0].name).toEqual(beat.tracks[0].name);
    expect(result.tracks[0].steps.getStepAtIndex(0)).toEqual(beat.tracks[0].steps.getStepAtIndex(0));
    expect(result.tracks[0].steps.getStepAtIndex(3)).toEqual(beat.tracks[0].steps.getStepAtIndex(3));
  })
});
