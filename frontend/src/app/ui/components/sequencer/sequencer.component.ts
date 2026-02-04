import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Beat} from '../../../core/domain/beat';
import {NgFor} from '@angular/common';
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {BpmInputComponent} from "../bpm-input/bpm-input.component";
import {SelectInputComponent} from "../select-input/select-input.component";
import {Track} from "../../../core/domain/track";
import {IManageBeatsToken} from "../../../infrastructure/injection-tokens/i-manage-beat.token";
import IManageBeats from "../../../core/domain/ports/secondary/i-manage-beats";
import {AUDIO_ENGINE} from "../../../infrastructure/injection-tokens/audio-engine.token";
import {IAudioEngine} from "../../../core/domain/ports/secondary/i-audio-engine";
import {FormsModule} from "@angular/forms";
import {TrackSignature} from "../../../core/domain/trackSignature";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {TempoAdapterService} from "../../../infrastructure/adapters/secondary/tempo-control/tempo-adapter.service";
import {PlayerEventsService} from "../../services/player.events.service";
import {BPM} from "../../../core/domain/bpm";
import {StepIndex} from "../../../core/domain/step-index";

@Component({
  selector: 'sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss'],
  imports: [NgFor, BpmInputComponent, SelectInputComponent, FormsModule]
})
export class SequencerComponent implements OnInit, OnDestroy {
  readonly customBeatSubject = new BehaviorSubject<Beat | null>(null);
  private readonly beatBehaviourSubject: Subject<Beat>;
  protected readonly Math = Math;

  beat = {} as Beat;
  private genres: Map<string, Beat[]> = new Map();

  genresLabel: readonly string[] = [];
  beats: readonly string[] = [];

  isMobileDisplay: boolean = false;

  selectedGenreLabel: string = "";
  selectedBeatLabel: string = "";
  private readonly destroy$ = new Subject<void>;

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
      this.tempoService.setSignature(beat.tracks[0].signature);
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
      this.selectGenre(this.genres, firstBeat.genre);
      this.selectBeat(beats[0]);
    }).catch(() => {
    });
  }

  genreChange = ($event: string) => this.selectGenre(this.genres, $event);

  selectGenre(genres: Map<string, Beat[]>, genre: string): void {
    const beats = genres.get(genre)!;
    this.selectedGenreLabel = genre;
    this.beats = beats.map(x => x.label);
    this.selectBeat(beats[0]);
  }

  selectBeat(beatToSelect: Beat | undefined): void {
    if (beatToSelect == undefined) return;
    this.beat = beatToSelect;
    this.beatBehaviourSubject.next(this.beat);
    this.selectedBeatLabel = this.beat.label;
    this.customBeatSubject.next(this.beat);
  }

  beatChange($event: string) {
    const beatToSelect = this.genres.get(this.selectedGenreLabel)!.find(x => x.label === $event);
    this.selectBeat(beatToSelect);
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
    const newBpm = BPM($event);
    this.tempoService.setBpm(newBpm);
    this.beat = this.beat = {
      ...this.beat,
      bpm: newBpm,
    };
    this.customBeatSubject.next(this.beat);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly TrackSignature = TrackSignature;
  protected readonly StepIndex = StepIndex;
}
