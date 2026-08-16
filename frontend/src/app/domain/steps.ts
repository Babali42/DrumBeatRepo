export class Steps {
  private readonly _steps: readonly boolean[];

  constructor(steps: readonly boolean[]) {
    this._steps = [...steps];
  }

  getStepAtIndex(index: number): boolean {
    return this._steps[index];
  }

  get steps(): readonly boolean[] {
    return this._steps;
  }
}
