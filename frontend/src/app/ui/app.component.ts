import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {ModeToggleService} from "./services/light-dark-mode/mode-toggle.service";
import {Mode} from './services/light-dark-mode/mode-toggle.model';
import {Router} from "@angular/router";
import {Subject, takeUntil} from "rxjs";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  isMobileDisplay: boolean = true;
  isPortrait: boolean = false;
  isLandscape: boolean = false;
  mode: Mode = Mode.LIGHT;
  destroy$ = new Subject<void>();

  constructor(private readonly responsive: BreakpointObserver,
              private readonly modeToggleService: ModeToggleService,
              private readonly router: Router) {
    this.modeToggleService.modeChanged$.subscribe(x => this.mode = x);
    this.checkOrientation();
  }

  ngOnInit(): void {
    this.responsive.observe([
      Breakpoints.Web,
    ]).pipe(takeUntil(this.destroy$)).subscribe(result => {
      this.isMobileDisplay = !result.matches;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
