import {TempoAdapterService} from "./tempo-adapter.service";
import {TrackSignature} from "../../../../core/domain/trackSignature";

describe('Tempo service : ', () => {
  it('computes step and bar durations correctly', () => {
    const tempo = new TempoAdapterService();
    expect(tempo.stepDuration).toBeCloseTo( 0.117); // for 128 bpm, 16-step
    expect(tempo.barDuration).toBeCloseTo( 1.875);
  });

  type TempoDataSet = {
    trackSignature: number;
    expectedBeatsPerBar: number;
  };

  const cases: TempoDataSet[] = [
    { trackSignature: TrackSignature.sixty_four, expectedBeatsPerBar: 16 },
    { trackSignature: TrackSignature.thirty_two, expectedBeatsPerBar: 8 },
    { trackSignature: TrackSignature.sixteen, expectedBeatsPerBar: 4 },
    { trackSignature: TrackSignature.eight, expectedBeatsPerBar: 2 },
  ];

  cases.forEach(({ trackSignature, expectedBeatsPerBar }) => {
    const tempo = new TempoAdapterService();
    it(`${trackSignature} steps long track should be ${expectedBeatsPerBar} bars long `, () => {
      tempo.setSignature(trackSignature);
      expect(tempo.beatsPerBar).toBe(expectedBeatsPerBar);
    });
  });
});
