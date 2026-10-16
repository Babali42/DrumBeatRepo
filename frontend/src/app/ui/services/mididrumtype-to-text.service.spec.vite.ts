import {MidiDrumTypeToTextService} from "./mididrumtype-to-text.service";
import {Option} from "effect";
import {MidiDrumType} from "../../domain/midi-drum-type";
import { describe, expect, it } from "vitest";

describe("Midi drum type to drums category text tests", () => {
  it.each([
    [MidiDrumType.ACOUSTIC_BASS_DRUM, "Kick"],
    [MidiDrumType.BASS_DRUM_1, "Kick"],
    [MidiDrumType.ACOUSTIC_SNARE, "Snare"],
    [MidiDrumType.HAND_CLAP, "Snare"],
    [MidiDrumType.ELECTRIC_SNARE, "Snare"],
    [MidiDrumType.LOW_FLOOR_TOM, "Tom"],
    [MidiDrumType.CLOSED_HI_HAT, "High-Hats"],
    [MidiDrumType.HIGH_FLOOR_TOM, "Tom"],
    [MidiDrumType.PEDAL_HI_HAT, "High-Hats"],
    [MidiDrumType.LOW_TOM, "Tom"],
    [MidiDrumType.OPEN_HI_HAT, "High-Hats"],
    [MidiDrumType.LOW_MID_TOM, "Tom"],
    [MidiDrumType.HI_MID_TOM, "Tom"],
    [MidiDrumType.CRASH_CYMBAL_1, "Cymbal"],
    [MidiDrumType.HIGH_TOM, "Tom"],
    [MidiDrumType.RIDE_CYMBAL_1, "Cymbal"],
    [MidiDrumType.CHINESE_CYMBAL, "Cymbal"],
    [MidiDrumType.SPLASH_CYMBAL, "Cymbal"],
    [MidiDrumType.CRASH_CYMBAL_2, "Cymbal"],
    [MidiDrumType.RIDE_CYMBAL_2, "Cymbal"],
  ])("%s should be %s", (midiDrumType, expectedText) => {
    // Arrange
    const systemUnderTest = new MidiDrumTypeToTextService();

    // Act
    const result = systemUnderTest.getMidiDrumTypeText(
      Option.some(midiDrumType),
    );

    // Assert
    expect(Option.isSome(result)).toBeTruthy();
    expect(Option.getOrElse(result, () => "")).toBe(expectedText);
  });
});
