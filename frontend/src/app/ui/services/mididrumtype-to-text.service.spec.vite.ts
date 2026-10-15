import {MidiDrumTypeToTextService} from "./mididrumtype-to-text.service";
import {Option} from "effect";
import {MidiDrumType} from "../../domain/midi-drum-type";
import { describe, expect, it } from "vitest";

describe("Midi drum type to drums category text tests", () => {
  it.each([
    [MidiDrumType.ACOUSTIC_BASS_DRUM, "Kicks"],
    [MidiDrumType.BASS_DRUM_1, "Kicks"],
    [MidiDrumType.ACOUSTIC_SNARE, "Snares"],
    [MidiDrumType.HAND_CLAP, "Snares"],
    [MidiDrumType.ELECTRIC_SNARE, "Snares"],
    [MidiDrumType.LOW_FLOOR_TOM, "Toms"],
    [MidiDrumType.CLOSED_HI_HAT, "High-Hats"],
    [MidiDrumType.HIGH_FLOOR_TOM, "Toms"],
    [MidiDrumType.PEDAL_HI_HAT, "High-Hats"],
    [MidiDrumType.LOW_TOM, "Toms"],
    [MidiDrumType.OPEN_HI_HAT, "High-Hats"],
    [MidiDrumType.LOW_MID_TOM, "Toms"],
    [MidiDrumType.HI_MID_TOM, "Toms"],
    [MidiDrumType.CRASH_CYMBAL_1, "Cymbals"],
    [MidiDrumType.HIGH_TOM, "Toms"],
    [MidiDrumType.RIDE_CYMBAL_1, "Cymbals"],
    [MidiDrumType.CHINESE_CYMBAL, "Cymbals"],
    [MidiDrumType.SPLASH_CYMBAL, "Cymbals"],
    [MidiDrumType.CRASH_CYMBAL_2, "Cymbals"],
    [MidiDrumType.RIDE_CYMBAL_2, "Cymbals"],
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
