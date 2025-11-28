import {Bpm} from "../../../domain/bpm";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class TempoAdapterService {
  public bpm: Bpm = new Bpm(128);
  public signature: number = 16;
  private beatsPerBar: number = 4;

  setBpm(bpm: Bpm) {
    this.bpm = bpm;
  }

  setSignature(signature: number) {
    this.signature = signature;

    if(this.signature == 64)
      this.beatsPerBar = 16;
    else if(this.signature == 32)
      this.beatsPerBar = 8;
    else
      this.beatsPerBar = 4;
  }

  get stepDuration(): number {
    return this.barDuration / this.signature;
  }

  get barDuration(): number {
    return (60 / this.bpm.value) * this.beatsPerBar;
  }

  /** Pure math: given a time offset in seconds, where does a step fall? */
  getNextStepTime(baseTime: number, stepIndex: number): number {
    const bar = Math.floor(baseTime / this.barDuration);
    return bar * this.barDuration + stepIndex * this.stepDuration;
  }
}
