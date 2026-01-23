import {Component, input, output } from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-select-input',
    imports: [FormsModule],
    templateUrl: './select-input.component.html',
    styleUrl: './select-input.component.scss'
})
export class SelectInputComponent {
  elements = input<readonly string[]>([]);
  selectedElement = input<string>('');
  placeHolder = input<string>('');

  selectChange = output<string>();

  onSelectChange(value: string) {
    this.selectChange.emit(value);
  }
}
