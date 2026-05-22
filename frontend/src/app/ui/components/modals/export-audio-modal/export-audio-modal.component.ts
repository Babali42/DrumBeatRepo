import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ExportOptions, ExportFormat, ExportQuality} from '../../../../domain/export-options';
import {TranslatePipe} from "@ngx-translate/core";
import {BaseExportModalComponent} from "../base-export-modal.component";

@Component({
  selector: 'app-export-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslatePipe],
  templateUrl: './export-audio-modal.component.html',
  styleUrl: '../../../../../styles/modals/modal.base.scss'
})
export class ExportAudioModalComponent extends BaseExportModalComponent<ExportOptions> {
  @Input() override isOpen: boolean = false;
  @Input() override beatName: string = '';

  @Output() override close = new EventEmitter<void>();
  @Output() override export = new EventEmitter<ExportOptions>();

  loopCounts: number[] = [1, 2, 4];

  override options: ExportOptions = {
    format: 'mp3',
    loopCount: 1,
    quality: 192
  };

  formats: ExportFormat[] = ['mp3', 'wav'];
  qualities: ExportQuality[] = [128, 192, 320];
}
