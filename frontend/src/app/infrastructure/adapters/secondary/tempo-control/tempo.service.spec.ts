import {TempoAdapterService} from "./tempo-adapter.service";

describe('Tempo service', () => {
  it('computes step and bar durations correctly', () => {
    const tempo = new TempoAdapterService();
    expect(tempo.stepDuration).toBeCloseTo( 0.117); // for 128 bpm, 16-step
    expect(tempo.barDuration).toBeCloseTo( 1.875);
  });
});
