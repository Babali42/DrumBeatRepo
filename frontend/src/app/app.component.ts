import {Component, HostListener, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {ModeToggleService} from "./services/light-dark-mode/mode-toggle.service";
import {Mode} from './services/light-dark-mode/mode-toggle.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  isMobileDisplay: boolean = true;
  isPortrait: boolean = false;
  isLandscape: boolean = false;
  mode: Mode = Mode.LIGHT;

  constructor(private readonly responsive: BreakpointObserver,
              private readonly modeToggleService: ModeToggleService) {
    this.modeToggleService.modeChanged$.subscribe(x => this.mode = x);
    this.checkOrientation();
  }

  ngOnInit(): void {
    this.responsive.observe([
      Breakpoints.Web,
    ]).subscribe(result => {
      this.isMobileDisplay = !result.matches;
    });
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
}
