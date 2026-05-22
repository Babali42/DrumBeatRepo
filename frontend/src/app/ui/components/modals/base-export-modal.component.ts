import {Input, Output, EventEmitter, Directive} from '@angular/core';

export interface BaseExportOptions {

}

@Directive()
export class BaseExportModalComponent<T extends BaseExportOptions> {
  @Input() isOpen: boolean = false;
  @Input() beatName: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() export = new EventEmitter<T>();

  options!: T;

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
