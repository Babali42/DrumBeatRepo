import { Injectable } from '@angular/core';
import { MidiExportOptions } from '../../../domain/midi-export-options';
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

    const events: MidiWriter.NoteEvent[] = [];
    const TICKS_PER_STEP = 32;

    for (const track of beat.tracks) {
      if (Option.isNone(track.midiNote)) {
        continue;
      }

      const midiNote = track.midiNote.value;

      track.steps.steps.forEach((active, stepIndex) => {
        if (!active) {
          return;
        }

        const tick = stepIndex * TICKS_PER_STEP;

        events.push(
          new MidiWriter.NoteEvent({
            pitch: [midiNote],
            startTick: tick,
            duration: 'T32',
            channel: 10,
            velocity: 100
          })
        );
      });
    }

    events.sort((a, b) => a.data.tick - b.data.tick);

    midiTrack.addEvent(events);

    return midiTrack;
  }
}
