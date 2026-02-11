import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Beat} from '../../../core/domain/beat';
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {BpmInputComponent} from "../bpm-input/bpm-input.component";
import {SelectInputComponent} from "../select-input/select-input.component";
import {Track} from "../../../core/domain/track";
import {IManageBeatsToken} from "../../../infrastructure/injection-tokens/i-manage-beat.token";
import IManageBeats from "../../../core/domain/ports/secondary/i-manage-beats";
import {AUDIO_ENGINE} from "../../../infrastructure/injection-tokens/audio-engine.token";
import {IAudioEngine} from "../../../core/domain/ports/secondary/i-audio-engine";
import {FormsModule} from "@angular/forms";
import {NumberOfSteps} from "../../../core/domain/numberOfSteps";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {TempoAdapterService} from "../../../infrastructure/adapters/secondary/tempo-control/tempo-adapter.service";
import {PlayerEventsService} from "../../services/player.events.service";
import {BPM} from "../../../core/domain/bpm";
import {StepIndex} from "../../../core/domain/step-index";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss'],
  imports: [BpmInputComponent, SelectInputComponent, FormsModule, TranslatePipe]
})
export class SequencerComponent implements OnInit, OnDestroy {
  readonly customBeatSubject = new BehaviorSubject<Beat | null>(null);
  private readonly beatBehaviourSubject: Subject<Beat>;
  private readonly destroy$ = new Subject<void>;

  protected readonly Math = Math;
  protected readonly NumberOfSteps = NumberOfSteps;
  protected readonly StepIndex = StepIndex;

  beat = {} as Beat;
  genres: Map<string, Beat[]> = new Map();

  genresLabel: readonly string[] = [];
  beats: readonly string[] = [];

  isMobileDisplay: boolean = false;
  selectedGenreLabel: string = "";

  constructor(@Inject(IManageBeatsToken) private readonly _beatsManager: IManageBeats,
              @Inject(AUDIO_ENGINE) public readonly soundService: IAudioEngine,
              private readonly responsive: BreakpointObserver,
              protected readonly tempoService: TempoAdapterService,
              private readonly playerEvents: PlayerEventsService) {
    this.beatBehaviourSubject = new Subject<Beat>();

    this.responsive.observe([
      Breakpoints.Web,
    ]).pipe(takeUntil(this.destroy$)).subscribe(result => {
      this.isMobileDisplay = !result.matches;
    });

    this.playerEvents.playPause$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.soundService.playPause());
  }

  ngOnInit() {
    this.beatBehaviourSubject.subscribe(beat => {
      this.tempoService.setNumberOfSteps(beat.tracks[0].numberOfSteps);
      this.tempoService.setBpm(beat.bpm);
      this.soundService.setTracks(beat.tracks);
    });

    this._beatsManager.getAllBeats().then(beats => {
      this.genres = new Map<string, Beat[]>();

      for (const beat of beats) {
        if (!this.genres.has(beat.genre))
          this.genres.set(beat.genre, []);
        this.genres.get(beat.genre)!.push(beat);
      }

      this.genresLabel = [...this.genres.keys()];
      const firstBeat = this.genres.values().next().value!?.[0];
      this.selectGenre(firstBeat.genre);
      this.selectBeat(beats[0]);
    }).catch(() => {
    });
  }

  selectGenre(genre: string): void {
    this.selectedGenreLabel = genre;
    const beats = this.genres.get(genre)!;
    this.beats = beats.map(x => x.label);
    this.selectBeat(beats[0]);
  }

  selectBeat(beatToSelect: Beat): void {
    this.beat = beatToSelect;
    this.beatBehaviourSubject.next(this.beat);
    this.customBeatSubject.next(this.beat);
  }

  beatChange($event: string) {
    const beatToSelect = this.genres.get(this.selectedGenreLabel)!.find(x => x.label === $event);
    this.selectBeat(beatToSelect!);
  }

  stepClick = (track: Track, stepIndex: StepIndex, value: boolean): void => {
    track.steps.setStepAtIndex(stepIndex, !value);

    if (!track.steps.getStepAtIndex(stepIndex)) {
      this.soundService.disableStep(track.fileName, stepIndex);
    } else {
      this.soundService.enableStep(track.fileName, stepIndex);
    }

    this.beat = {
      ...this.beat,
      tracks: this.beat.tracks
    };

    this.customBeatSubject.next(this.beat);
  }

  changeBeatBpm($event: number) {
    this.soundService.pause();
    this.tempoService.setBpm(BPM($event));
    this.beat = this.beat = {
      ...this.beat,
      bpm: BPM($event),
    };
    this.customBeatSubject.next(this.beat);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
