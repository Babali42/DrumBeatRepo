import {beatsGroupedByGenre} from "./beat-source/beats-adapter.service";
import {BeatUrlMapper} from "./beat-url.mapper";

describe("Beat url mapper tests", () => {
  it("Should map compact beat to url to compact beat", () => {
    const compactBeat = beatsGroupedByGenre[4].beats[0];
    const base64Beat = BeatUrlMapper.toBase64(compactBeat);

    const result = BeatUrlMapper.fromBase64(base64Beat);

    expect(result.label).toEqual(compactBeat.label);
    expect(result.bpm).toEqual(compactBeat.bpm);
    expect(result.tracks.length).toEqual(compactBeat.tracks.length);
    expect(result.tracks[0].name).toEqual(compactBeat.tracks[0].name);
    expect(result.tracks[0].steps).toEqual(compactBeat.tracks[0].steps);
  })
});
