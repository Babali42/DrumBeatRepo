import {Pipe, PipeTransform} from '@angular/core';
import {Option} from "effect";
import {MidiDrumType} from "../../domain/midi-drum-type";

@Pipe({
  name: 'drumImage'
})
export class DrumImagePipe implements PipeTransform {

  readonly drumImages: Record<number, string> = {
    36: 'kick',
    38: 'snare',
    42: 'hihats',
    46: 'hihats'
  };

  readonly getDrumPath = (midi: number): string =>
    this.drumImages[midi] ?? 'default';

  transform(midi: Option.Option<MidiDrumType>): string {
    return Option.match(midi, {
      onNone: () => `assets/images/drums/default.svg`,
      onSome: (midi) => `assets/images/drums/${this.getDrumPath(midi)}.svg`,
    })
  }
}
