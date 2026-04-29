import {Component, inject, Input, OnChanges, output, SimpleChanges} from '@angular/core';
import {LongPressDirective} from "../../directives/long-press.directive";
import {maxBpm, minBpm} from "../../../core/domain/bpm";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-bpm-input',
  templateUrl: './bpm-input.component.html',
  imports: [
    LongPressDirective,
    ReactiveFormsModule
  ],
  styleUrl: './bpm-input.component.scss'
})
export class BpmInputComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() bpm!: number;
  form = this.fb.group({
    bpm: [this.bpm, [
      Validators.required,
      Validators.min(minBpm),
      Validators.max(maxBpm)
    ]]
  });

  maxBpm = maxBpm;
  minBpm = minBpm;
  bpmChange = output<number>();

  constructor() {
    this.form.controls.bpm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        if (value != null) {
          this.bpmChange.emit(value);
        }
      });
  }

  incrementBpm = () => this.updateBpm(Math.min(this.form.controls.bpm.value! + 1, this.maxBpm));
  decrementBpm = () => this.updateBpm(Math.max(this.form.controls.bpm.value! - 1, this.minBpm));

  private updateBpm = (value: number) => {
    this.form.controls.bpm.setValue(Number(value));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bpm']) {
      this.form.controls.bpm.setValue(changes['bpm'].currentValue)
    }
  }
}
