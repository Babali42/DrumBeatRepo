import {Component, HostListener} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {ModeToggleService} from "./services/light-dark-mode/mode-toggle.service";
import {Mode} from './services/light-dark-mode/mode-toggle.model';
import {Router} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs/operators";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  isPortrait: boolean = false;
  isLandscape: boolean = false;
  mode: Mode = Mode.LIGHT;

  readonly isMobile = toSignal(
    this.responsive.observe([Breakpoints.Web]).pipe(
      map(result => !result.matches)
    ),
    { initialValue: true }
  );

  constructor(private readonly responsive: BreakpointObserver,
              private readonly modeToggleService: ModeToggleService,
              private readonly router: Router) {
    this.modeToggleService.modeChanged$.subscribe(x => this.mode = x);
    this.checkOrientation();
  }

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(): void {
    this.checkOrientation();
  }

  checkOrientation(): void {
    const orientation = window.screen.orientation.angle;
    this.isPortrait = orientation === 0 || orientation === 180;
    this.isLandscape = orientation === 90 || orientation === -90;
  }

  protected readonly Mode = Mode;

  async goToMainPage() {
    await this.router.navigate([], {
      queryParams: {},
      queryParamsHandling: '',
    }).then(() => {
      window.location.reload();
    }).catch();
  }
}
