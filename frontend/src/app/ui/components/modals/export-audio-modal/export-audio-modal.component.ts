import {Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AudioExportOptions, DEFAULT_EXPORT_OPTIONS} from '../../../../domain/export-options/audio-export-options';
import {TranslatePipe} from "@ngx-translate/core";
import {BaseExportModalComponent} from "../base-export-modal.component";
import {toWavFilename, WavFilename} from "../../../../domain/filenames/wav.filepath";

@Component({
  selector: 'app-export-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslatePipe, ReactiveFormsModule],
  templateUrl: "./export-audio-modal.component.html",
  styleUrl: "../../../../../styles/modals/modal.base.scss"
})
export class ExportAudioModalComponent extends BaseExportModalComponent<AudioExportOptions> implements OnChanges {
  private readonly fb = inject(FormBuilder);

  loopCounts: readonly number[] = [1, 2, 4];

  @Input() override isOpen: boolean = false;
  @Input() override beatName: string = "file";

  @Output() override close = new EventEmitter<void>();
  @Output() override export = new EventEmitter<AudioExportOptions>();
  form = this.fb.nonNullable.group({
    fileName: new FormControl<WavFilename>(toWavFilename(this.beatName + ".wav"), [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required,
      Validators.pattern(/^[^.].+\.wav$/i)
    ]),
    loopCount: new FormControl<1 | 2| 4>(1),
    exportWithTail: new FormControl<boolean>(true)
  })

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['beatName']) {
      this.form.controls.fileName.setValue(toWavFilename(this.beatName + ".wav"));
    }
  }

  override options: AudioExportOptions = DEFAULT_EXPORT_OPTIONS;

  override onExport(): void {
    if (this.form.valid) {
      this.export.emit({
        fileName: this.form.controls.fileName.value!,
        loopCount: this.form.controls.loopCount.value!,
        exportWithTail: this.form.controls.exportWithTail.value!,
      });
    }
  }
}
