import { Input, Output, EventEmitter, Directive } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BaseModalOptions {

}

@Directive()
export class BaseModalComponent<T extends BaseModalOptions> {
  @Input() isOpen: boolean = false;
  @Input() beatName: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() validate = new EventEmitter<T>();

  options!: T;

  onClose(): void {
    this.close.emit();
  }

  onValidate(): void {
    this.validate.emit(this.options);
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose();
    }
  }
}
