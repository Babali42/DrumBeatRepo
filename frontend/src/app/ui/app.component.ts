import {Component, HostListener, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {ModeToggleService} from "./services/light-dark-mode/mode-toggle.service";
import {Mode} from './services/light-dark-mode/mode-toggle.model';
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs/operators";
import {TranslatePipe} from "@ngx-translate/core";
import {LoadingBarModule} from "@ngx-loading-bar/core";
import {NgTemplateOutlet} from '@angular/common';
import {SequencerComponent} from './components/sequencer/sequencer.component';
import {SelectInputComponent} from './components/select-input/select-input.component';
import {SequencerService} from './services/sequencer/sequencer.service';
import {BeatMetadata} from 'src/types/engine';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [SequencerComponent, SelectInputComponent, NgTemplateOutlet, TranslatePipe, LoadingBarModule]
})
export class AppComponent implements OnInit {
  isPortrait: boolean = false;
  isLandscape: boolean = false;
  mode: Mode = Mode.LIGHT;

  //in Breakpoints.Web and in landscape 1280px is the limit
  readonly isMobile = toSignal(
    this.responsive.observe([Breakpoints.Web]).pipe(
      map(result => !result.matches)
    ),
    { initialValue: true }
  );

  constructor(private readonly responsive: BreakpointObserver,
              private readonly modeToggleService: ModeToggleService,
              public readonly sequencerService: SequencerService) {
    this.modeToggleService.modeChanged$.subscribe(x => this.mode = x);
    this.checkOrientation();
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async ngOnInit(): Promise<void> {
    await this.sequencerService.initialize();

    const firstGenre = this.sequencerService.genresLabel[0];
    if (firstGenre) {
      this.genreChange(firstGenre);
    }
  }

  genreChange(genre: string): void {
    const beatsFromGenre = this.sequencerService.genres.get(genre);

    if (!beatsFromGenre || beatsFromGenre.length === 0)
      return;

    this.selectBeat(beatsFromGenre[0]);
  }

  beatChange(beat: string): void {
    const currentGenre = this.sequencerService.vm$.getValue().genre;
    const beatsFromGenre = this.sequencerService.genres.get(currentGenre);

    if (!beatsFromGenre)
      return;

    const beatToSelect = beatsFromGenre.find(x => x.label === beat);

    this.selectBeat(beatToSelect);
  }

  selectBeat(beatToSelect: BeatMetadata | undefined): void {
    if (!beatToSelect)
      return;

    void this.sequencerService.dispatch({
      type: 'SELECT_BEAT',
      payload: {
        genre: beatToSelect.genre,
        beat: beatToSelect.label
      }
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

  goToMainPage() {
     window.location.reload();
  }
}
