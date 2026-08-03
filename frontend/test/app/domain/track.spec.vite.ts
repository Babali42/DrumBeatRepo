import { expect, test } from 'vitest'
import { MidiDrumType } from "../../../src/app/domain/midi-drum-type";
import { Option } from "effect";
import { Track } from "../../../src/app/domain/track";
import { toMp3FilePath } from "../../../src/app/domain/filenames/mp3.filepath";

test("Should not be created with unsupported step count", () => {
  expect(() => new Track("Kick", toMp3FilePath("test.wav"), [true, false], Option.some(MidiDrumType.BASS_DRUM_1))).toThrow();
});

test("Should be created with right step number", () => {
  const track = new Track("Kick", toMp3FilePath("test.mp3"), [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false], Option.some(MidiDrumType.BASS_DRUM_1));
  expect(track.name).toBe("Kick");
  expect(track.steps.steps.length).toBe(16);
  expect(track.beatsPerBar).toBe(4);
  expect(track.subdivisionsPerBeat).toBe(4);
});

test("Should be created with ternary step number", () => {
  const track = new Track("Kick", toMp3FilePath("test.mp3"), [true, false, false, true, false, false, true, false, false, true, false, false], Option.some(MidiDrumType.BASS_DRUM_1));
  expect(track.name).toBe("Kick");
  expect(track.steps.steps.length).toBe(12);
  expect(track.beatsPerBar).toBe(4);
  expect(track.subdivisionsPerBeat).toBe(3);
});

test("Should be created with ternary step number", () => {
  const track = new Track("Kick", toMp3FilePath("test-ternary.mp3"), [true, false, false, true, false, false, true, false, false, true, false, false], Option.some(MidiDrumType.BASS_DRUM_1));
  expect(track).toBeDefined();
});

