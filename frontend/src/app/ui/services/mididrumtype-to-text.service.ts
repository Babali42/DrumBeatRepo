import { Option } from "effect";
import { MidiDrumType } from "../../domain/midi-drum-type";
import { MidiDrumTypeCategory } from "../../domain/midi-drum-type.category";

export class MidiDrumTypeToTextService {
  private static readonly drumTypeToCategory = new Map<MidiDrumType, MidiDrumTypeCategory>([
    [MidiDrumType.ACOUSTIC_BASS_DRUM, MidiDrumTypeCategory.Kick],
    [MidiDrumType.BASS_DRUM_1, MidiDrumTypeCategory.Kick],

    [MidiDrumType.ACOUSTIC_SNARE, MidiDrumTypeCategory.Snare],
    [MidiDrumType.HAND_CLAP, MidiDrumTypeCategory.Snare],
    [MidiDrumType.ELECTRIC_SNARE, MidiDrumTypeCategory.Snare],

    [MidiDrumType.LOW_FLOOR_TOM, MidiDrumTypeCategory.Tom],
    [MidiDrumType.HIGH_FLOOR_TOM, MidiDrumTypeCategory.Tom],
    [MidiDrumType.LOW_TOM, MidiDrumTypeCategory.Tom],
    [MidiDrumType.LOW_MID_TOM, MidiDrumTypeCategory.Tom],
    [MidiDrumType.HI_MID_TOM, MidiDrumTypeCategory.Tom],
    [MidiDrumType.HIGH_TOM, MidiDrumTypeCategory.Tom],

    [MidiDrumType.CLOSED_HI_HAT, MidiDrumTypeCategory.Hats],
    [MidiDrumType.PEDAL_HI_HAT, MidiDrumTypeCategory.Hats],
    [MidiDrumType.OPEN_HI_HAT, MidiDrumTypeCategory.Hats],

    [MidiDrumType.CRASH_CYMBAL_1, MidiDrumTypeCategory.Cymbal],
    [MidiDrumType.RIDE_CYMBAL_1, MidiDrumTypeCategory.Cymbal],
    [MidiDrumType.CHINESE_CYMBAL, MidiDrumTypeCategory.Cymbal],
    [MidiDrumType.SPLASH_CYMBAL, MidiDrumTypeCategory.Cymbal],
    [MidiDrumType.CRASH_CYMBAL_2, MidiDrumTypeCategory.Cymbal],
    [MidiDrumType.RIDE_CYMBAL_2, MidiDrumTypeCategory.Cymbal],
  ]);

  getMidiDrumTypeText(value: Option.Option<MidiDrumType>): Option.Option<string> {
    if (Option.isNone(value))
      return Option.none();

    const category = MidiDrumTypeToTextService.drumTypeToCategory.get(value.value);

    return Option.fromUndefinedOr(category);
  }
}
