export class Bpm {
  value: number;
  static readonly minBpm = 40;
  static readonly maxBpm = 300;

  constructor(value: number) {
    if (!this.isValidBPM(value)) {
      throw new Error(`Invalid BPM '${value}'. Must be between ${Bpm.minBpm} and ${Bpm.maxBpm}.`);
    }

    this.value = value;
  }

  private isValidBPM(value: number): boolean {
    return value >= Bpm.minBpm && value <= Bpm.maxBpm;
  }
}
