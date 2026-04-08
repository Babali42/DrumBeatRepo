import {Component, input, output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ExportOptions, ExportFormat, ExportQuality} from '../../../core/domain/export-options';

@Component({
  selector: 'app-export-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './export-modal.component.html',
  styleUrl: './export-modal.component.scss'
})
export class ExportModalComponent {
  isOpen = input<boolean>(false);
  beatName = input<string>('');

  close = output<void>();
  export = output<ExportOptions>();

  options: ExportOptions = {
    format: 'mp3',
    loopCount: 1,
    quality: 192
  };

  formats: ExportFormat[] = ['mp3', 'wav'];
  loopCounts: (1 | 2 | 4)[] = [1, 2, 4];
  qualities: ExportQuality[] = [128, 192, 320];

  onClose(): void {
    this.close.emit();
  }

  onExport(): void {
    this.export.emit(this.options);
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose();
    }
  }
}
