import {Bpm} from "./bpm";

export class TempoService {
  constructor(
    public bpm: Bpm = new Bpm(120),
    public signature: number = 16
  ) {}

  setBpm(bpm: Bpm) {
    this.bpm = bpm;
  }

  setSignature(signature: number) {
    this.signature = signature;
  }

  get stepDuration(): number {
    return 60 / (this.bpm.value * (this.signature / 4));
  }

  get barDuration(): number {
    return this.signature * this.stepDuration;
  }

  /** Pure math: given a time offset in seconds, where does a step fall? */
  getNextStepTime(baseTime: number, stepIndex: number): number {
    const bar = Math.floor(baseTime / this.barDuration);
    return bar * this.barDuration + stepIndex * this.stepDuration;
  }
}
