import {TempoService} from "./tempo.service";
import {Bpm} from "./bpm";

describe('Tempo service', () => {
  it('computes step and bar durations correctly', () => {
    const tempo = new TempoService(new Bpm(120), 16);
    expect(tempo.stepDuration).toBeCloseTo(0.125); // for 120 bpm, 16-step
    expect(tempo.barDuration).toBeCloseTo(2.0);
  });
});
