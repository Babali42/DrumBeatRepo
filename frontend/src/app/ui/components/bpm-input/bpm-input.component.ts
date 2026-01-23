import {Component, input, output} from '@angular/core';
import {LongPressDirective} from "../../directives/long-press.directive";
import {Bpm} from "../../../core/domain/bpm";

@Component({
    selector: 'app-bpm-input',
    templateUrl: './bpm-input.component.html',
    imports: [
        LongPressDirective
    ],
    styleUrl: './bpm-input.component.scss'
})
export class BpmInputComponent {
  maxBpm = Bpm.maxBpm;
  minBpm = Bpm.minBpm;
  bpm = input(Bpm.minBpm);
  bpmChange = output<number>();

  incrementBpm = () => this.updateBpm(Math.min(this.bpm() + 1, this.maxBpm));
  decrementBpm = () => this.updateBpm(Math.max(this.bpm() - 1, this.minBpm));

  updateNumber(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let value = Number(inputElement.value);
    value = Math.min(value, this.maxBpm);
    value = Math.max(value, this.minBpm);
    this.updateBpm(value);
  }

  private updateBpm = (value: number) => this.bpmChange.emit(value);
}
