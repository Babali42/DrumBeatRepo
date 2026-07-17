import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from "@ngx-translate/core";
import { BaseModalComponent } from "../base-modal.component";
import { MidiExportOptions } from "../../../../domain/export-options/midi-export-options";
import { LoopCount } from "../../../../domain/export-options/audio-export-options";
import { MidiFilename, toMidiFilename } from "../../../../domain/filenames/midi.filename";
import { IconDarkModePipe } from "../../../pipes/icon-dark-mode.pipe";

@Component({
  selector: 'app-export-midi-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslatePipe, ReactiveFormsModule, NgOptimizedImage, IconDarkModePipe],
  templateUrl: './export-midi-modal.component.html',
  styleUrl: '../../../../../styles/modals/modal.base.scss'
})
export class ExportMidiModalComponent extends BaseModalComponent<MidiExportOptions> implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() override isOpen: boolean = false;
  @Input() override beatName: string = 'myFile';

  @Output() override close = new EventEmitter<void>();
  @Output() override validate = new EventEmitter<MidiExportOptions>();

  override options: MidiExportOptions = {
    fileName: toMidiFilename('file.mid')
  };

  form = this.fb.nonNullable.group({
    fileName: new FormControl<MidiFilename>(toMidiFilename(this.beatName + ".mid"), [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required,
      Validators.pattern(/^[^.].+\.mid$/i)
    ]),
    loopCount: new FormControl<LoopCount>(1, [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required]),
  })

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['beatName']) {
      this.form.controls.fileName.setValue(toMidiFilename(this.beatName + ".mid"));
    }
  }

  override onValidate(): void {
    if (this.form.valid) {
      this.validate.emit({
        fileName: this.form.controls.fileName.value!,
      });
    }
  }
}
