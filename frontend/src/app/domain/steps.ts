export class Steps {
  private _steps: readonly boolean[];

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
