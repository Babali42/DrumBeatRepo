import {Option} from "effect";
import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Beat} from '../../../domain/beat';
import {BehaviorSubject, Subject, takeUntil, tap} from "rxjs";
import {BpmInputComponent} from "../bpm-input/bpm-input.component";
import {SelectInputComponent} from "../select-input/select-input.component";
import {Track} from "../../../domain/track";
import IManageBeats from "../../../domain/ports/i-manage-beats";
import {IAudioEngine} from "../../../domain/ports/i-audio-engine";
import {FormsModule} from "@angular/forms";
import {NumberOfSteps} from "../../../domain/number-of-steps";
import {TempoAdapterService} from "../../../infrastructure/adapters/tempo-control/tempo-adapter.service";
import {PlayerEventsService} from "../../services/player.events.service";
import {BPM} from "../../../domain/bpm";
import {StepIndex} from "../../../domain/step-index";
import {TranslateModule} from "@ngx-translate/core";
import {Steps} from "../../../domain/steps";
import {ExportAudioModalComponent} from "../modals/export-audio-modal/export-audio-modal.component";
import {AudioExportOptions} from "../../../domain/export-options/audio-export-options";
import {MaxMidiNote} from "../../../domain/midi-drum-type";
import {ExportMidiModalComponent} from "../modals/export-midi-modal/export-midi-modal.component";
import {MidiExportOptions} from "../../../domain/export-options/midi-export-options";
import {downloadBlob} from "../../../infrastructure/adapters/utils/blob.utils";
import {IMIDI} from "../../../infrastructure/injection-tokens/i-midi.token";
import {IMidi} from "../../../domain/ports/i-midi";
import {IManageBeatsToken} from "../../../infrastructure/injection-tokens/i-manage-beat.token";
import {AUDIO_ENGINE} from "../../../infrastructure/injection-tokens/audio-engine.token";
import {AUDIO_EXPORT} from "../../../infrastructure/injection-tokens/audio-export.token";
import {IAudioExport} from "../../../domain/ports/i-audio-export";
import {NgOptimizedImage} from "@angular/common";
import {DrumImagePipe} from "../../pipes/drum-image.pipe";
import {IconDarkModePipe} from "../../pipes/icon-dark-mode.pipe";
import {SequencerService} from "./sequencer.service";

@Component({
  selector: 'sequencer',
  standalone: true,
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss'],
  imports: [BpmInputComponent, SelectInputComponent, FormsModule, TranslateModule, ExportAudioModalComponent, ExportMidiModalComponent, NgOptimizedImage, DrumImagePipe, IconDarkModePipe],
  changeDetection: ChangeDetectionStrategy.Eager
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

  selectedGenreLabel: string = "";
  isAudioExportModalOpen = false;
  isMidiExportModalOpen = false;
  historyLength: number = 0;
  futureLength: number = 0;

  constructor(@Inject(IManageBeatsToken) private readonly _beatsManager: IManageBeats,
              @Inject(AUDIO_ENGINE) public readonly soundService: IAudioEngine,
              @Inject(AUDIO_EXPORT) public readonly audioExportAdapter: IAudioExport,
              protected readonly tempoService: TempoAdapterService,
              private readonly playerEvents: PlayerEventsService,
              @Inject(IMIDI) public readonly midiExportService: IMidi,
              protected readonly sequencerService: SequencerService) {
    this.beatBehaviourSubject = new Subject<Beat>();

    this.playerEvents.playPause$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.soundService.playPause());
  }

  ngOnInit() {
    this.sequencerService.state$.pipe(
      tap(state => {
        if (state) {
          this.historyLength = state.historyLength;
          this.futureLength = state.futureLength;

          if (state.genre) {
            this.selectedGenreLabel = state.genre;
            this.beats = this.genres.get(state.genre)?.map(b => b.label) ?? [];
          }

          if (state.beat && state.genre) {
            const beat = this.genres.get(state.genre)?.find(b => b.label === state.beat);
            if (beat) this._applyBeat(beat);
          }
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    this.beatBehaviourSubject.pipe(
      tap(beat => {
        this.tempoService.setNumberOfSteps(beat.tracks[0].numberOfSteps);
        this.tempoService.setBpm(beat.bpm);
        this.soundService.setTracks(beat.tracks);
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    this._beatsManager.getAllBeats().then(beats => {
      this.genres = new Map<string, Beat[]>();

      for (const beat of beats) {
        if (!this.genres.has(beat.genre))
          this.genres.set(beat.genre, [beat]);
        else
          this.genres.get(beat.genre)!.push(beat);
      }

      this.genresLabel = [...this.genres.keys()];
      const firstBeat = beats[0];
      if (firstBeat) {
        this.sequencerService.dispatch({ type: 'SELECT_GENRE', payload: { genre: firstBeat.genre } });
        this.sequencerService.dispatch({ type: 'SELECT_BEAT', payload: { beat: firstBeat.label } });
      }
    }).catch(() => {
    });
  }

  private _applyBeat(beatToSelect: Beat): void {
    const orderedTracks: Track[] = beatToSelect.tracks.map(track => ({
      ...track,
      steps: new Steps(track.steps.steps)
    })).sort((a: Track, b: Track) => Option.getOrElse(b.midiNote, () => MaxMidiNote) - Option.getOrElse(a.midiNote, () => MaxMidiNote));

    this.beat = {
      ...beatToSelect,
      tracks: orderedTracks
    };
    this.beatBehaviourSubject.next(this.beat);
    this.customBeatSubject.next(this.beat);
  }

  selectGenre(genre: string): void {
    this.beats = this.genres.get(genre)?.map(b => b.label) ?? [];
    this.sequencerService.dispatch({ type: 'SELECT_GENRE', payload: { genre } });
    const firstBeat = this.genres.get(genre)?.[0];
    if (firstBeat) {
      this.sequencerService.dispatch({ type: 'SELECT_BEAT', payload: { beat: firstBeat.label } });
    }
  }

  selectBeat(beatToSelect: Beat): void {
    this.sequencerService.dispatch({ type: 'SELECT_BEAT', payload: { beat: beatToSelect.label } });
  }

  beatChange($event: string) {
    const beatToSelect = this.genres.get(this.selectedGenreLabel)?.find(x => x.label === $event);
    if (beatToSelect) {
      this.selectBeat(beatToSelect);
    }
  }

  stepClick = (track: Track, stepIndex: StepIndex, value: boolean): void => {
    track.steps.setStepAtIndex(stepIndex, !value);

    if (!track.steps.getStepAtIndex(stepIndex)) {
      this.soundService.disableStep(track.name, stepIndex);
    } else {
      this.soundService.enableStep(track.name, stepIndex);
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
    this.beat = {
      ...this.beat,
      bpm: BPM($event),
    };
    this.customBeatSubject.next(this.beat);
  }

  async onAudioExport(options: AudioExportOptions): Promise<void> {
    this.isAudioExportModalOpen = false;

    try {
      const blob = await this.audioExportAdapter.exportBeat(
        this.beat.tracks,
        options
      );

      downloadBlob(blob, options.fileName);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }

  async onMidiExport(options: MidiExportOptions) {
    this.isMidiExportModalOpen = false;

    try {
      const blob = await this.midiExportService.exportBeat(this.beat);

      downloadBlob(blob, options.fileName);
    } catch (error) {
      console.error('Midi export failed:', error);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
