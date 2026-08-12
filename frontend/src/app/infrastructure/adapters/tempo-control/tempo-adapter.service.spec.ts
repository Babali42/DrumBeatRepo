import {TempoAdapterService} from "./tempo-adapter.service";
import {BPM} from "../../../domain/bpm";
import {Seconds} from "../../../domain/seconds";
import {BeatsPerBar} from "../../../domain/beatsPerBar";
import {NumberOfSteps} from "../../../domain/number-of-steps";
import {SubdivisionsPerBeat} from "../../../domain/subdivisionsPerBeat";

describe('Tempo service', () => {
  type TempoDataSet = {
    tempo: BPM;
    beatsPerBar: BeatsPerBar;
    subdivisionsPerBeat: SubdivisionsPerBeat;
    expectedStepDuration: Seconds;
  };

  const cases: TempoDataSet[] = [
    { tempo: BPM(128), beatsPerBar: 4, subdivisionsPerBeat: 4, expectedStepDuration: Seconds(0.1171875) },
    { tempo: BPM(128), beatsPerBar: 8, subdivisionsPerBeat: 4, expectedStepDuration: Seconds(0.1171875) },
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
    expect(service.numberOfSteps).toBe(NumberOfSteps.twelve);
  });

  it('recalculates numberOfSteps and supports 64-step tracks', () => {
    const service = new TempoAdapterService();
    service.setBeatsPerBar(16);
    service.setSubdivisionsPerBeat(4);
    expect(service.numberOfSteps).toBe(NumberOfSteps.sixty_four);
  });

  it('supports 32-step patterns with two bars', () => {
    const service = new TempoAdapterService();
    service.setBeatsPerBar(4);
    service.setSubdivisionsPerBeat(4);
    service.setNumberOfBar(2);
    expect(service.numberOfSteps).toBe(NumberOfSteps.thirty_two);
  });

  it('supports 64-step patterns with four bars', () => {
    const service = new TempoAdapterService();
    service.setBeatsPerBar(4);
    service.setSubdivisionsPerBeat(4);
    service.setNumberOfBar(4);
    expect(service.numberOfSteps).toBe(NumberOfSteps.sixty_four);
  });

  it('keeps a single bar as 16 steps by default', () => {
    const service = new TempoAdapterService();
    service.setBeatsPerBar(4);
    service.setSubdivisionsPerBeat(4);
    service.setNumberOfBar(1);
    expect(service.numberOfSteps).toBe(NumberOfSteps.sixteen);
  });
});
