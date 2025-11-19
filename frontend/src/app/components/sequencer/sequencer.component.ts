import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Beat} from '../../domain/beat';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {BeatsGroupedByGenre} from "../../domain/beatsGroupedByGenre";
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {BpmInputComponent} from "../bpm-input/bpm-input.component";
import {SelectInputComponent} from "../select-input/select-input.component";
import {Track} from "../../domain/track";
import {CompactBeatMapper} from "../../domain/compact-beat.mapper";
import {IManageBeatsToken} from "../../infrastructure/injection-tokens/i-manage-beat.token";
import IManageBeats from "../../domain/ports/secondary/i-manage-beats";
import {AUDIO_ENGINE} from "../../infrastructure/injection-tokens/audio-engine.token";
import {IAudioEngine} from "../../domain/ports/secondary/i-audio-engine";
import {FormsModule} from "@angular/forms";
import {Bpm} from "../../domain/bpm";
import {TrackSignature} from "../../domain/trackSignature";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {TempoService} from "../../adapters/secondary/tempo/tempo.service";
import {PlayerEventsService} from "../../services/player.events.service";

@Component({
    selector: 'sequencer',
    templateUrl: './sequencer.component.html',
    styleUrls: ['./sequencer.component.scss'],
  imports: [NgFor, BpmInputComponent, SelectInputComponent, FormsModule, AsyncPipe, NgIf]
})
export class SequencerComponent implements OnInit, OnDestroy {
  readonly customBeatSubject = new BehaviorSubject<Beat | null>(null);
  private readonly beatBehaviourSubject: Subject<Beat>;
  protected readonly Math = Math;

  beat = {} as Beat;
  genre = {} as BeatsGroupedByGenre;

  genresLabel: readonly string[] = [];
  beats: readonly string[] = [];
  private genres: readonly BeatsGroupedByGenre[] = [];

  isMobileDisplay: boolean = false;

  selectedGenreLabel: string = "";
  selectedBeatLabel: string = "";
  private readonly destroy$ = new Subject<void>;

  constructor(@Inject(IManageBeatsToken) private readonly _beatsManager: IManageBeats,
              @Inject(AUDIO_ENGINE) public readonly soundService: IAudioEngine,
              private readonly responsive: BreakpointObserver,
              protected readonly tempoService: TempoService,
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

    this._beatsManager.getBeatsGroupedByGenres().then(genres => {
      this.genres = genres;
      this.genresLabel = genres.map(x => x.label);
      this.selectGenre(genres, null, null);
    }).catch(() => { });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  genreChange = ($event: string)=> this.selectGenre(this.genres, $event, null);

  selectGenre(genres: readonly BeatsGroupedByGenre[], genre: string | null, beat: string | null): void {
    const firstGenre = genre ? genres.find(x => x.label === genre) : genres[0];
    if (!firstGenre) return;

    this.genre = firstGenre;
    this.selectedGenreLabel = firstGenre.label;
    this.beats = firstGenre.beats.map(x => x.label);

    const beatToSelect = beat ? firstGenre.beats.find(x => x.id === beat) : firstGenre.beats[0];
    const fullBeat = CompactBeatMapper.toBeat(beatToSelect!);
    this.selectBeat(fullBeat);
  }

  selectBeat(beatToSelect: Beat | undefined): void {
    if (beatToSelect == undefined) return;
    this.beat = beatToSelect;
    this.beatBehaviourSubject.next(this.beat);
    this.selectedBeatLabel = this.beat.label;
    this.customBeatSubject.next(this.beat);
  }

  beatChange($event: string) {
    const beatToSelect = this.genres.find(x => x.label === this.selectedGenreLabel)?.beats.find(x => x.label === $event);
    const fullBeat = CompactBeatMapper.toBeat(beatToSelect!);
    this.selectBeat(fullBeat);
  }

  stepClick = (track: Track, stepIndex: number, value: boolean) : void => {
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
    this.tempoService.setBpm(new Bpm($event));
    this.beat = this.beat = {
      ...this.beat,
      bpm: new Bpm($event),
    };
    this.customBeatSubject.next(this.beat);
  }

  protected readonly TrackSignature = TrackSignature;
}
