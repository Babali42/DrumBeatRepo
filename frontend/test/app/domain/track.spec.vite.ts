import {expect, test} from 'vitest'
import {MidiDrumType} from "../../../src/app/domain/midi-drum-type";
import {Option} from "effect";
import {Track} from "../../../src/app/domain/track";

test("Should not be created with unsupported step count", () => {
  expect(() => new Track("Kick", "", [true, false], Option.some(MidiDrumType.BASS_DRUM_1))).toThrow();
});

test("Should be created with right step number", () => {
  const track = new Track("Kick", "", [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false], Option.some(MidiDrumType.BASS_DRUM_1));
  expect(track).toBeDefined();
});
