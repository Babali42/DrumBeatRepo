import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Beat} from '../../../core/domain/beat';
import {NgFor} from '@angular/common';
import {BeatsGroupedByGenre} from "../../view-models/beatsGroupedByGenre";
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {BpmInputComponent} from "../bpm-input/bpm-input.component";
import {SelectInputComponent} from "../select-input/select-input.component";
import {Track} from "../../../core/domain/track";
import {CompactBeatMapper} from "../../../infrastructure/adapters/secondary/beat-source/compact-beat.mapper";
import {IManageBeatsToken} from "../../../infrastructure/injection-tokens/i-manage-beat.token";
import IManageBeats from "../../../core/domain/ports/secondary/i-manage-beats";
import {AUDIO_ENGINE} from "../../../infrastructure/injection-tokens/audio-engine.token";
import {IAudioEngine} from "../../../core/domain/ports/secondary/i-audio-engine";
import {FormsModule} from "@angular/forms";
import {Bpm} from "../../../core/domain/bpm";
import {TrackSignature} from "../../../core/domain/trackSignature";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {TempoAdapterService} from "../../../infrastructure/adapters/secondary/tempo-control/tempo-adapter.service";
import {PlayerEventsService} from "../../services/player.events.service";
import {InMemoryBeatGateway} from "../../../infrastructure/adapters/secondary/beat-source/in-memory-beat-gateway";

@Component({
  selector: 'sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss'],
  imports: [NgFor, BpmInputComponent, SelectInputComponent, FormsModule],
  providers: [
    {provide: IManageBeatsToken, useClass: InMemoryBeatGateway},
  ]
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

    console.log('_beatsManager:', this._beatsManager);
    console.log('getAllBeats exists:', typeof this._beatsManager.getAllBeats);
  }

  ngOnInit() {
    this.beatBehaviourSubject.subscribe(beat => {
      this.tempoService.setSignature(beat.tracks[0].signature);
      this.tempoService.setBpm(beat.bpm);
      this.soundService.setTracks(beat.tracks);
    });

    this._beatsManager.getAllBeats().then(beats => {
      this.selectBeat(beats[0]);
    }).catch(() => {
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  genreChange = ($event: string) => this.selectGenre(this.genres, $event, null);

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

  stepClick = (track: Track, stepIndex: number, value: boolean): void => {
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
