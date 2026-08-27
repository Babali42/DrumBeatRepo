import { TempoAdapterService } from "./tempo-adapter.service";
import { BPM } from "../../../domain/bpm";
import { Seconds } from "../../../domain/seconds";

describe('Tempo service', () => {
  type TempoDataSet = {
    tempo: BPM;
    beatsPerBar: number;
    subdivisionsPerBeat: number;
    expectedStepDuration: Seconds;
  };

  const cases: TempoDataSet[] = [
    { tempo: BPM(128), beatsPerBar: 4, subdivisionsPerBeat: 4, expectedStepDuration: Seconds(0.1171875) },
    { tempo: BPM(128), beatsPerBar: 8, subdivisionsPerBeat: 4, expectedStepDuration: Seconds(0.1171875) },
    { tempo: BPM(135), beatsPerBar: 4, subdivisionsPerBeat: 3, expectedStepDuration: Seconds(0.14814814814814814) },
  ];

  cases.forEach(({ tempo, beatsPerBar, subdivisionsPerBeat, expectedStepDuration }) => {
    const service = new TempoAdapterService();
    it(`${subdivisionsPerBeat * beatsPerBar} steps long track at ${tempo} BPM should be ${expectedStepDuration} step long because it does not depends on step number`, () => {
      service.setBeatsPerBar(beatsPerBar);
      service.setSubdivisionsPerBeat(subdivisionsPerBeat);
      service.setBpm(tempo);
      expect(service.stepDuration).toBe(expectedStepDuration);
    });
  });

  it('recalculates numberOfSteps when subdivisionsPerBeat is set before beatsPerBar', () => {
    const service = new TempoAdapterService();
    service.setSubdivisionsPerBeat(3);
    service.setBeatsPerBar(4);
    expect(service.numberOfSteps).toBe(12);
  });

  it('recalculates numberOfSteps and supports 64-step tracks', () => {
    const service = new TempoAdapterService();
    service.setBeatsPerBar(16);
    service.setSubdivisionsPerBeat(4);
    expect(service.numberOfSteps).toBe(64);
  });

  it('supports 32-step patterns with two bars', () => {
    const service = new TempoAdapterService();
    service.setBeatsPerBar(4);
    service.setSubdivisionsPerBeat(4);
    service.setNumberOfBar(2);
    expect(service.numberOfSteps).toBe(32);
  });

  it('supports 64-step patterns with four bars', () => {
    const service = new TempoAdapterService();
    service.setBeatsPerBar(4);
    service.setSubdivisionsPerBeat(4);
    service.setNumberOfBar(4);
    expect(service.numberOfSteps).toBe(64);
  });

  it('keeps a single bar as 16 steps by default', () => {
    const service = new TempoAdapterService();
    service.setBeatsPerBar(4);
    service.setSubdivisionsPerBeat(4);
    service.setNumberOfBar(1);
    expect(service.numberOfSteps).toBe(16);
  });
});
