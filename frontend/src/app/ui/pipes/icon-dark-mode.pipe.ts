import {OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {ModeToggleService} from "../services/light-dark-mode/mode-toggle.service";
import {Subscription} from "rxjs";
import {Mode} from "../services/light-dark-mode/mode-toggle.model";

@Pipe({
  name: 'iconDarkMode',
  pure: false
})
export class IconDarkModePipe implements PipeTransform, OnDestroy {

  private mode: Mode = Mode.LIGHT;
  private readonly subscription: Subscription;

  constructor(private readonly modeToggleService: ModeToggleService) {
    this.subscription = this.modeToggleService.modeChanged$.subscribe(x => this.mode = x);
  }

  transform(value: string, ...args: unknown[]): string {
    return value.replace(".svg", `-${this.mode == Mode.LIGHT ? "light" : "dark"}.svg`);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
