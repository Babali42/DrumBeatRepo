import { Injectable } from '@angular/core';
import { MidiExportOptions } from '../../../domain/export-options/midi-export-options';
import { IMidi } from '../../../domain/ports/i-midi';
import {Beat} from "../../../domain/beat";
import {Option} from "effect";
// @ts-ignore
import MidiWriter from 'midi-writer-js';

@Injectable()
export class MidiExportService implements IMidi {
  async exportBeat(
    beat: Beat,
    options: MidiExportOptions
  ): Promise<Blob> {
    const track = this.getTrack(beat);
    const writer = new MidiWriter.Writer(track);
    return new Blob([writer.buildFile()], { type: 'audio/midi' });
  }

  public getTrack : (beat: Beat) => any = (beat: Beat) : any => {
    const midiTrack = new MidiWriter.Track();
    midiTrack.addTrackName(beat.label);
    midiTrack.setTempo(beat.bpm.valueOf());
    midiTrack.setTimeSignature(4, 4);

    const TICKS_PER_STEP = 32;
    const events: { tick: number; event: MidiWriter.NoteEvent }[] = [];

    for (const track of beat.tracks) {
      if (Option.isNone(track.midiNote)) {
        continue;
      }

      const midiNote = track.midiNote.value;

      track.steps.steps.forEach((active, stepIndex) => {
        if (!active) {
          return;
        }

        const EMPTY_STEPS_AT_START = 16;

        const tick =
          (stepIndex + EMPTY_STEPS_AT_START) * TICKS_PER_STEP;

        events.push({
          tick,
          event: new MidiWriter.NoteEvent({
            pitch: [midiNote],
            startTick: tick,
            duration: 'T32',
            channel: 10,
            velocity: 100
          })
        });
      });
    }

    events.sort((a, b) => a.tick - b.tick);

    midiTrack.addEvent(events.map(e => e.event));

    return midiTrack;
  }
}
