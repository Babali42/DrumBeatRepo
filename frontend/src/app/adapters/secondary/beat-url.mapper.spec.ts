import {beatsGroupedByGenre} from "./beats/beats-in-memory-data";
import {BeatUrlMapper} from "./beat-url.mapper";

describe("Beat url mapper tests", () => {
  it("Should map compact beat to url to compact beat", () => {
    const beat = beatsGroupedByGenre[4].beats[0];
    const base64Beat = BeatUrlMapper.toBase64(beat);

    const result = BeatUrlMapper.fromBase64(base64Beat);

    expect(result.label).toEqual(beat.label);
    expect(result.bpm).toEqual(beat.bpm);
    expect(result.genre).toEqual(beat.genre);
    expect(result.tracks.length).toEqual(beat.tracks.length);
    expect(result.tracks[0].name).toEqual(beat.tracks[0].name);
    expect(result.tracks[0].steps).toEqual(beat.tracks[0].steps);
  })
});
