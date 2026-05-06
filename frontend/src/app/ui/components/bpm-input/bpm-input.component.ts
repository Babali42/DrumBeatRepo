import { Component, effect, inject, input, output } from '@angular/core';
import { LongPressDirective } from "../../directives/long-press.directive";
import { maxBpm, minBpm } from "../../../domain/bpm";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { distinctUntilChanged, filter, map } from "rxjs/operators";

@Component({
  selector: 'app-bpm-input',
  templateUrl: './bpm-input.component.html',
  imports: [LongPressDirective, ReactiveFormsModule],
  styleUrl: './bpm-input.component.scss'
})
export class BpmInputComponent {
  private readonly fb = inject(FormBuilder);

  maxBpm = maxBpm;
  minBpm = minBpm;
  bpmChange = output<number>();
  bpm = input(128);

  form = this.fb.group({
    bpm: [this.bpm(), [
      Validators.required,
      Validators.min(minBpm),
      Validators.max(maxBpm)
    ]]
  });

  constructor() {
    effect(() => {
      this.updateBpm(this.bpm(), false);  // runs on init + every change
    });

    this.form.controls.bpm.valueChanges
      .pipe(
        filter(() => this.form.controls.bpm.valid),
        map(value => Number(value)),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe(value => this.bpmChange.emit(value));
  }

  incrementBpm = () => this.updateBpm(Math.min(this.form.controls.bpm.value! + 1, this.maxBpm), true);

  decrementBpm = () => this.updateBpm(Math.max(this.form.controls.bpm.value! - 1, this.minBpm), true);

  private readonly updateBpm = (value: number, emitEvent: boolean) => this.form.controls.bpm.setValue(Number(value), { emitEvent: emitEvent });
}
