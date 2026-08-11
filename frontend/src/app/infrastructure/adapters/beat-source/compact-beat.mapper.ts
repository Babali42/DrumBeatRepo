import { Beat } from "../../../domain/beat";
import { CompactBeat } from "./compact-beat";
import { Track } from "../../../domain/track";
import { BPM } from "../../../domain/bpm";
import { MidiDrumType } from "../../../domain/midi-drum-type";
import { Effect, Option } from "effect";

const MIDI_DRUM_TYPE_VALUES = Object.values(MidiDrumType).filter(v => typeof v === 'number') as readonly number[];

export function isValidMidiDrumType(value: unknown): value is MidiDrumType {
  return typeof value === 'number' && MIDI_DRUM_TYPE_VALUES.includes(value);
}

export class CompactBeatMapper {
  static toBeatEffect(compact: CompactBeat): Effect.Effect<Beat, Error> {
    return Effect.try({
      try: () => ({
        label: compact.label,
        genre: compact.genre,
        bpm: parseBPM(compact.bpm),
        tracks: compact.tracks.map(track => new Track(
          track.name,
          track.filename,
          [...track.steps].map(char => char === 'X'),
          track.isMuted ?? false,
          isValidMidiDrumType(track.midiNote) ? Option.some(track.midiNote) : Option.none(),
          track.beatsPerBar,
          track.subdivisionsPerBeat
        ))
      }),
      catch: (e) => {
        return e instanceof Error ? e : new Error(String(e))
      }
    });
  }

  static toCompactBeat(beat: Beat): CompactBeat {
    return {
      label: beat.label,
      genre: beat.genre,
      bpm: beat.bpm,
      tracks: beat.tracks.map(track => ({
        name: track.name,
        filename: track.filename,
        steps: track.steps.steps.map(x => x ? "X" : " ").join(''),
        isMuted: track.isMuted,
        midiNote: Option.isNone(track.midiNote) ? undefined : track.midiNote.value,
        beatsPerBar: track.beatsPerBar,
        subdivisionsPerBeat: track.subdivisionsPerBeat
      }))
    }
  }
}

export function parseBPM(value: unknown): BPM {
  const n =
    typeof value === "number" ? value :
      typeof value === "string" ? Number(value) :
        NaN;

  return BPM(n);
}
