import {Component, EventEmitter, Input, Output} from '@angular/core';
import {LongPressDirective} from "../../directives/long-press.directive";
import {Bpm} from "../../domain/bpm";

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
  @Input() bpm : number = Bpm.minBpm;
  @Output() bpmChange = new EventEmitter<number>();

  incrementBpm() {
    this.updateBpm(Math.min(this.bpm+1, this.maxBpm));
  }

  decrementBpm() {
    this.updateBpm(Math.max(this.bpm-1, this.minBpm));
  }

  updateNumber(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let value = Number(inputElement.value);
    value = Math.min(value, this.maxBpm);
    value = Math.max(value, this.minBpm);
    this.updateBpm(value);
  }

  private updateBpm(value: number): void {
    this.bpm = value;
    this.bpmChange.emit(this.bpm);
  }
}
