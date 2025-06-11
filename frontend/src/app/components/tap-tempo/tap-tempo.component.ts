import {Component, Inject} from '@angular/core';
import {AUDIO_ENGINE} from "../../infrastructure/injection-tokens/audio-engine.token";
import {IAudioEngine} from "../../domain/ports/secondary/i-audio-engine";

@Component({
  selector: 'tap-tempo',
  standalone: true,
  templateUrl: './tap-tempo.component.html',
  styleUrl: './tap-tempo.component.scss'
})
export class TapTempoComponent {

  constructor(@Inject(AUDIO_ENGINE) public readonly audioEngine: IAudioEngine) {

  }

  private groundZero = 0;
  private lastTap = 0;
  private counter = 0;
  private tapDiff = 0;
  private averageBpm = 0;
  private previousTap = 0;
  private elapsed = 0;

  changeBeatBpm($event: number) {
    this.audioEngine.setBpm($event);
  }

  tapTempo() {
    if (this.lastTap === 0) {
      this.groundZero = new Date().getTime();
      this.counter = 0;
    }

    this.lastTap = new Date().getTime();
    this.elapsed = new Date().getTime() - this.previousTap;

    this.previousTap = this.lastTap;
    this.tapDiff = this.lastTap - this.groundZero;
    if (this.tapDiff !== 0) {
      this.averageBpm = Math.round((60000 * this.counter) / this.tapDiff);
    }

    this.counter++;

    this.changeBeatBpm(this.averageBpm);

    if (this.elapsed > 3000) {
      this.lastTap = 0;
    }
  }
}
