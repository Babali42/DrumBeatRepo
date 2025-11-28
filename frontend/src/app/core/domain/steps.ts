export class Steps {
  readonly steps: boolean[];

  constructor(steps: boolean[]) {
    this.steps = steps;
  }

  getStepAtIndex = (index: number) => this.steps[index];

  setStepAtIndex = (stepIndex: number, value: boolean): void => {
    this.steps[stepIndex] = value;
  }
}
