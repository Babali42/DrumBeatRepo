import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
    selector: 'app-select-input',
    imports: [FormsModule, NgForOf],
    templateUrl: './select-input.component.html',
    styleUrl: './select-input.component.scss'
})
export class SelectInputComponent {
  @Input() elements: readonly string[] = [];
  @Input() selectedElement: string = "";
  @Input() placeHolder: string = "";
  @Output() selectChange = new EventEmitter<string>();

  onSelectChange() {
    this.selectChange.emit(this.selectedElement);
  }
}
