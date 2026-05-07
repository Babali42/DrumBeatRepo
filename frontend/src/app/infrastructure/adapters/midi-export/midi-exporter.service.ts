import { Injectable } from '@angular/core';
import { MidiExportOptions } from '../../../domain/midi-export-options';
import { Track } from '../../../domain/track';
import { IMidi } from '../../../domain/ports/i-midi';
import {Beat} from "../../../domain/beat";

@Injectable()
export class MidiExportService implements IMidi {
  async exportBeat(
    beat: Beat,
    options: MidiExportOptions
  ): Promise<Blob> {
    return new Blob([], { type: 'audio/midi' });
  }
}
