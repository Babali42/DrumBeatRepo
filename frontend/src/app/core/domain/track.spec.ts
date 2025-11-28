import {Track} from "./track";

describe("Track", () => {
  it("Should not be created with odd step number", () => {
    expect(() => new Track("Kick", "", [true, false])).toThrow();
  });

  it("Should be created with right step number", () => {
    const track = new Track("Kick", "", [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false]);
    expect(track).toBeDefined();
  });
});
