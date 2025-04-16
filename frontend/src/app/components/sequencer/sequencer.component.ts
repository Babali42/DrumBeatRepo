import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {SoundService} from '../../services/sound/sound.service';
import {Beat} from '../../domain/beat';
import {NgFor} from '@angular/common';
import {StepLengths} from './models/step-lengths';
import {BeatsGroupedByGenre} from "../../domain/beatsGroupedByGenre";
import {ActivatedRoute} from '@angular/router';
import IManageBeats, {IManageBeatsToken} from "../../domain/ports/secondary/i-manage-beats";
import {Subject, timer} from "rxjs";
import {BpmInputComponent} from "../bpm-input/bpm-input.component";
import {SelectInputComponent} from "../select-input/select-input.component";
import {TapTempoComponent} from "../tap-tempo/tap-tempo.component";
import {Track} from "../../domain/track";

@Component({
  selector: 'sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss'],
  standalone: true,
  imports: [NgFor, BpmInputComponent, SelectInputComponent, TapTempoComponent]
})
export class SequencerComponent implements OnInit {
  beat = {} as Beat;
  genre = {} as BeatsGroupedByGenre;
  private readonly beatBehaviourSubject: Subject<Beat>;
  genresLabel: string[] = [];
  selectedGenreLabel: string = "";
  beats: string[] = [];
  selectedBeatLabel: string = "";
  private genres: BeatsGroupedByGenre[] = [];
  isTransitioning = false;

  constructor(@Inject(IManageBeatsToken)  private _beatsManager: IManageBeats,
              public soundService: SoundService,
              private route: ActivatedRoute) {
    this.beatBehaviourSubject = new Subject<Beat>();
  }

  ngOnInit() {
    this._beatsManager.getBeatsGroupedByGenres().then(genres => {
      this.genres = genres;
      this.genresLabel = genres.map(x => x.label);
      this.route.queryParamMap.subscribe((params) => {
        this.selectGenre(genres, params.get('genre'), params.get('beat'));
      });
    }).catch(error => { console.log(error); });

    this.beatBehaviourSubject.subscribe(beat => {
      if (this.soundService.isPlaying)
        this.soundService.pause();
      this.soundService.setBpm(beat.bpm);
      this.soundService.setTracks(beat.tracks);
      this.soundService.setStepNumber(beat.tracks[0].steps.length);
    });
  }

  toggleIsPlaying(): void {
    this.isTransitioning = true;
    timer(100).subscribe(()=> {
      this.soundService.playPause().then(
        () => {
        },
        () => {
        }
      );
      this.isTransitioning = false;
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.code == "Space") {
      this.toggleIsPlaying();
    }
  }

  selectGenre(genres : BeatsGroupedByGenre[], genre: string | null, beat: string | null): void {
    const firstGenre = genre ? genres.find(x => x.label === genre) : genres[0];
    if (!firstGenre) return;

    this.genre = firstGenre;
    this.selectedGenreLabel = firstGenre.label;
    this.beats = firstGenre.beats.map(x => x.label);

    const beatToSelect = beat ? firstGenre.beats.find(x => x.id === beat) : firstGenre.beats[0];
    this.selectBeat(beatToSelect);
  }

  selectBeat(beatToSelect: Beat | undefined): void {
    if (beatToSelect == undefined) return;
    this.beat = beatToSelect;
    this.beatBehaviourSubject.next(this.beat);
    this.selectedBeatLabel = this.beat.label;
  }

  protected readonly StepLengths = StepLengths;
  protected readonly Math = Math;

  changeBeatBpm($event: number) {
    this.soundService.setBpm($event);
  }

  genreChange($event: string) {
    this.selectGenre(this.genres, $event, null);
  }

  beatChange($event: string) {
    const beatToSelect = this.genres.find(x => x.label === this.selectedGenreLabel)?.beats.find(x => x.label === $event);
    this.selectBeat(beatToSelect);
  }

  playTrack(trackName: string) {
    this.soundService.playTrack(trackName);
  }

  stepClick(track: Track, stepIndex: number, value: boolean) {
    track.steps[stepIndex] = !value;

    if(!track.steps[stepIndex]){
      this.soundService.stopBeat(track.fileName, stepIndex);
    }else{
      this.soundService.startBeat(track.fileName, stepIndex);
    }
  }
  protected readonly SoundService = SoundService;
}

