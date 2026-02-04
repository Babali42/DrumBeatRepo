import {TempoAdapterService} from "./tempo-adapter.service";
import {NumberOfSteps} from "../../../../core/domain/numberOfSteps";
import {BPM} from "../../../../core/domain/bpm";
import {Seconds} from "../../../../core/domain/seconds";

describe('Tempo service', () => {
  type TempoDataSet = {
    numberOfSteps: number;
    tempo: BPM;
    expectedStepDuration: Seconds;
  };

  const cases: TempoDataSet[] = [
    { numberOfSteps: NumberOfSteps.sixty_four, tempo: BPM(128), expectedStepDuration: Seconds(0.1171875) },
    { numberOfSteps: NumberOfSteps.eight, tempo: BPM(128), expectedStepDuration: Seconds(0.1171875) },
  ];

  cases.forEach(({ numberOfSteps, tempo, expectedStepDuration }) => {
    const service = new TempoAdapterService();
    it(`${numberOfSteps} steps long track at ${tempo} BPM should be ${expectedStepDuration} step long because it does not depends on step number`, () => {
      service.setNumberOfSteps(numberOfSteps);
      service.setBpm(tempo);
      expect(service.stepDuration).toBe(expectedStepDuration);
    });
  });
});
