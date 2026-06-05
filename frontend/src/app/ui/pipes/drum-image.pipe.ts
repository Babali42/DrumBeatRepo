import {OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {Option} from "effect";
import {MidiDrumType} from "../../domain/midi-drum-type";
import {ModeToggleService} from "../services/light-dark-mode/mode-toggle.service";
import { Mode } from "../services/light-dark-mode/mode-toggle.model";
import {Subscription} from "rxjs";

@Pipe({
  name: 'drumImage',
  pure: false
})
export class DrumImagePipe implements PipeTransform, OnDestroy {
  private mode: Mode = Mode.LIGHT;
  private readonly subscription: Subscription;

  constructor(private readonly modeToggleService: ModeToggleService) {
    this.subscription = this.modeToggleService.modeChanged$.subscribe(x => this.mode = x);
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
