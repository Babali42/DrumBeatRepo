import {Brand} from "./brand";

export const minBpm = 40;
export const maxBpm = 300;

export type BPM = Brand<number, "BPM">;

export const BPM = (n: number) => {
  if (!isValidBPM(n)) {
    throw new Error(`Invalid BPM '${n}'. Must be between ${minBpm} and ${maxBpm}.`);
  }

  return n as BPM;
};

const isValidBPM = (value: number): boolean =>
  Number.isFinite(value) &&
  value >= minBpm &&
  value <= maxBpm;
