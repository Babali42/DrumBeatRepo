import {Component, effect, EventEmitter, inject, Input, OnChanges, Output, signal, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TranslatePipe} from "@ngx-translate/core";
import {BaseExportModalComponent} from "../base-export-modal.component";
import {MidiExportOptions} from "../../../../domain/midi-export-options";
import {LoopCount} from "../../../../domain/export-options";
import {MidiFilename, toMidiFilename} from "../../../../domain/midi.filename";

@Component({
  selector: 'app-export-midi-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslatePipe, ReactiveFormsModule],
  templateUrl: './export-midi-modal.component.html',
  styleUrl: '../../../../../styles/modals/modal.base.scss'
})
export class ExportMidiModalComponent extends BaseExportModalComponent<MidiExportOptions> implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() override isOpen: boolean = false;
  @Input() override beatName: string = 'myFile';

  @Output() override close = new EventEmitter<void>();
  @Output() override export = new EventEmitter<MidiExportOptions>();

  override options: MidiExportOptions = {
    fileName: '',
    loopCount: 1
  };

  form = this.fb.nonNullable.group({
    fileName: new FormControl<MidiFilename>(toMidiFilename(this.beatName + ".mid"), [
      Validators.required,
      Validators.pattern(/^[^.].+\.mid$/i)
    ]),
    loopCount: new FormControl<LoopCount>(1, [Validators.required]),
  })

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['beatName']) {
      this.form.controls.fileName.setValue(toMidiFilename(this.beatName + ".mid"));
    }
  }

  override onExport(): void {
    if (this.form.valid) {
      this.export.emit({
        fileName: this.form.controls.fileName.value!,
        loopCount: this.form.controls.loopCount.value!,
      });
    }
  }
}
