import {Track} from "../domain/track";
import {expect, test} from 'vitest'
import {MidiDrumType} from "../domain/midi-drum-type";

test("Should not be created with unsupported step count", () => {
  expect(() => new Track("Kick", "", [true, false], MidiDrumType.BASS_DRUM_1)).toThrow();
});

test("Should be created with right step number", () => {
  const track = new Track("Kick", "", [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false]);
  expect(track).toBeDefined();
});
