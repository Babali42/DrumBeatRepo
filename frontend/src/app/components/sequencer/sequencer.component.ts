import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {Beat} from '../../domain/beat';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {StepLengths} from './models/step-lengths';
import {BeatsGroupedByGenre} from "../../domain/beatsGroupedByGenre";
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, shareReplay, Subject} from "rxjs";
import {BpmInputComponent} from "../bpm-input/bpm-input.component";
import {SelectInputComponent} from "../select-input/select-input.component";
import {Track} from "../../domain/track";
import {TapTempoComponent} from "../tap-tempo/tap-tempo.component";
import {BeatUrlMapper} from "../../adapters/secondary/beat-url.mapper";
import {CompactBeatMapper} from "../../domain/compact-beat.mapper";
import {IManageBeatsToken} from "../../infrastructure/injection-tokens/i-manage-beat.token";
import IManageBeats from "../../domain/ports/secondary/i-manage-beats";
import {AUDIO_ENGINE} from "../../infrastructure/injection-tokens/audio-engine.token";
import {IAudioEngine} from "../../domain/ports/secondary/i-audio-engine";
import {FormsModule} from "@angular/forms";
import {filter, map} from "rxjs/operators";

@Component({
    selector: 'sequencer',
    templateUrl: './sequencer.component.html',
    styleUrls: ['./sequencer.component.scss'],
  imports: [NgFor, BpmInputComponent, SelectInputComponent, TapTempoComponent, FormsModule, AsyncPipe, NgIf]
})
export class SequencerComponent implements OnInit {

  private readonly customBeatSubject = new BehaviorSubject<Beat | null>(null);
  private readonly beatBehaviourSubject: Subject<Beat>;
  protected readonly StepLengths = StepLengths;
  protected readonly Math = Math;

  private genres: readonly BeatsGroupedByGenre[] = [];

  beat = {} as Beat;
  genre = {} as BeatsGroupedByGenre;
  genresLabel: readonly string[] = [];
  selectedGenreLabel: string = "";
  beats: readonly string[] = [];
  selectedBeatLabel: string = "";
  isCustomBeatPage: boolean = false;
  customBeatName: string = "";

  constructor(@Inject(IManageBeatsToken) private readonly _beatsManager: IManageBeats,
              @Inject(AUDIO_ENGINE) public readonly soundService: IAudioEngine,
              public readonly route: ActivatedRoute) {
    this.beatBehaviourSubject = new Subject<Beat>();
  }

  ngOnInit() {
    this.beatBehaviourSubject.subscribe(beat => {
      if (this.soundService.isPlaying)
        this.soundService.pause();
      this.soundService.setBpm(beat.bpm);
      this.soundService.setTracks(beat.tracks);
      this.soundService.setStepNumber(beat.tracks[0].steps.length);
    });

    this.route.queryParamMap.subscribe((params) => {
      const customBeatEncoded = params.get('beat');
      const customName = params.get('name');
      const customBpm = params.get('bpm');
      if (customBeatEncoded && customName && customBpm) {
        const customBeat = CompactBeatMapper.toBeat(BeatUrlMapper.fromBase64(customBeatEncoded));
        this.selectBeat(customBeat);
        this.isCustomBeatPage = true;
        this.customBeatName = `${customName} at ${customBpm} bpm`;
      } else {
        this._beatsManager.getBeatsGroupedByGenres().then(genres => {
          this.genres = genres;
          this.genresLabel = genres.map(x => x.label);
          this.selectGenre(genres, null, null);
        }).catch(() => { });
      }
    });
  }

  toggleIsPlaying = () => this.soundService.playPause();

  genreChange = ($event: string)=> this.selectGenre(this.genres, $event, null);

  getCustomBeatUrl = (base64beat: string, selectedBeatLabel: string, bpm: string) : string =>
    `${window.location.origin}/#/?name=Sort of ${selectedBeatLabel}&bpm=${bpm}&beat=${base64beat}`;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.code == "Space") {
      this.toggleIsPlaying();
    }
  }

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
    track.steps[stepIndex] = !value;

    if (!track.steps[stepIndex]) {
      this.soundService.stopBeat(track.fileName, stepIndex);
    } else {
      this.soundService.startBeat(track.fileName, stepIndex);
    }

    this.beat = {
      ...this.beat,
      tracks: this.beat.tracks
    };

    this.customBeatSubject.next(this.beat);
  }

  changeBeatBpm($event: number) {
    this.soundService.setBpm($event);
    this.beat = this.beat = {
      ...this.beat,
      bpm: $event,
    };
    this.customBeatSubject.next(this.beat);
  }



  readonly customBeatUrl$ = this.customBeatSubject.asObservable().pipe(
    filter((b): b is Beat => !!b),
    map((beat) => {
      const compact = CompactBeatMapper.toCompactBeat(beat);
      const base64 = BeatUrlMapper.toBase64(compact);
      return this.getCustomBeatUrl(base64, this.selectedBeatLabel, this.beat.bpm.toString());
    }),
    shareReplay(1)
  );
}
