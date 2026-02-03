import {BPM} from "./bpm";

describe("BPM", () => {
  it("Should create a Bpm", () => {
    expect(BPM(128).valueOf()).toBe(128);
  });

  it("Should not be able to create an invalid BPM", () => {
    expect(() => BPM(0)).toThrow();
    expect(() => BPM(500)).toThrow();
    expect(() => BPM(NaN)).toThrow();
    expect(() => BPM(Infinity)).toThrow();
  })
});
