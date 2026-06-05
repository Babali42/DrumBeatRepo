import { Pipe, PipeTransform } from '@angular/core';
import {Option} from "effect";
import {MidiDrumType} from "../../domain/midi-drum-type";
import {ModeToggleService} from "../services/light-dark-mode/mode-toggle.service";
import { Mode } from "../services/light-dark-mode/mode-toggle.model";

@Pipe({
  name: 'drumImage',
})
export class DrumImagePipe implements PipeTransform {
  private mode: Mode = Mode.LIGHT;

  constructor(private readonly modeToggleService: ModeToggleService) {
    this.modeToggleService.modeChanged$.subscribe(x => this.mode = x);
  }


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
      onNone: () => `assets/images/drums/${this.mode == Mode.LIGHT ? 'light' : 'dark'}/default.svg`,
      onSome: (midi) => `assets/images/drums/${this.mode == Mode.LIGHT ? 'light' : 'dark'}/${this.getDrumPath(midi)}.svg`,
    })
  }
}
