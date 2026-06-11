import { Injectable } from '@angular/core';
import { IMidi } from '../../../domain/ports/i-midi';
import {Beat} from "../../../domain/beat";
import {Option} from "effect";
// @ts-expect-error: midi-writer-js has no type declarations
import MidiWriter from 'midi-writer-js';

@Injectable()
export class MidiExportService implements IMidi {
  exportBeat(beat: Beat): Promise<Blob> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const track = this.getTrack(beat);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const writer = new MidiWriter.Writer(track);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return Promise.resolve(new Blob([writer.buildFile()], { type: 'audio/midi' }));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getTrack : (beat: Beat) => any = (beat: Beat) : any => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const midiTrack = new MidiWriter.Track();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    midiTrack.addTrackName(beat.label);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    midiTrack.setTempo(beat.bpm.valueOf());
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    midiTrack.setTimeSignature(4, 4);

    const TICKS_PER_STEP = 32;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const events: { tick: number; event: any }[] = [];

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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    midiTrack.addEvent(events.map(e => e.event));

    return midiTrack;
  }
}
