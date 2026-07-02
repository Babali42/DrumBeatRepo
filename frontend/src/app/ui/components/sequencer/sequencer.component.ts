import { Option } from "effect";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Beat } from '../../../domain/beat';
import { BehaviorSubject, Subject, takeUntil, tap } from "rxjs";
import { BpmInputComponent } from "../bpm-input/bpm-input.component";
import { SelectInputComponent } from "../select-input/select-input.component";
import { Track } from "../../../domain/track";
import IManageBeats from "../../../domain/ports/i-manage-beats";
import { IAudioEngine } from "../../../domain/ports/i-audio-engine";
import { FormsModule } from "@angular/forms";
import { NumberOfSteps } from "../../../domain/number-of-steps";
import { TempoAdapterService } from "../../../infrastructure/adapters/tempo-control/tempo-adapter.service";
import { PlayerEventsService } from "../../services/player.events.service";
import { BPM } from "../../../domain/bpm";
import { StepIndex } from "../../../domain/step-index";
import { Steps } from "../../../domain/steps";
import { ExportAudioModalComponent } from "../modals/export-audio-modal/export-audio-modal.component";
import { AudioExportOptions } from "../../../domain/export-options/audio-export-options";
import { MaxMidiNote } from "../../../domain/midi-drum-type";
import { ExportMidiModalComponent } from "../modals/export-midi-modal/export-midi-modal.component";
import { MidiExportOptions } from "../../../domain/export-options/midi-export-options";
import { downloadBlob } from "../../../infrastructure/adapters/utils/blob.utils";
import { IMIDI } from "../../../infrastructure/injection-tokens/i-midi.token";
import { IMidi } from "../../../domain/ports/i-midi";
import { IManageBeatsToken } from "../../../infrastructure/injection-tokens/i-manage-beat.token";
import { AUDIO_ENGINE } from "../../../infrastructure/injection-tokens/audio-engine.token";
import { AUDIO_EXPORT } from "../../../infrastructure/injection-tokens/audio-export.token";
import { IAudioExport } from "../../../domain/ports/i-audio-export";
import { NgOptimizedImage } from "@angular/common";
import { TranslatePipe } from "@ngx-translate/core";
import { DrumImagePipe } from "../../pipes/drum-image.pipe";
import { IconDarkModePipe } from "../../pipes/icon-dark-mode.pipe";
import { SequencerService } from "./sequencer.service";

@Component({
  selector: 'sequencer',
  standalone: true,
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss'],
  imports: [BpmInputComponent, SelectInputComponent, FormsModule, TranslatePipe, ExportAudioModalComponent, ExportMidiModalComponent, NgOptimizedImage, DrumImagePipe, IconDarkModePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SequencerComponent implements OnInit, OnDestroy {
  readonly customBeatSubject = new BehaviorSubject<Beat | null>(null);
  private readonly beatBehaviourSubject: Subject<Beat>;
  private readonly destroy$ = new Subject<void>;

  protected readonly Math = Math;
  protected readonly NumberOfSteps = NumberOfSteps;
  protected readonly StepIndex = StepIndex;

  beat = {} as Beat;
  genres: ReadonlyMap<string, readonly Beat[]> = new Map();

  genresLabel: readonly string[] = [];
  beats: readonly string[] = [];

  isAudioExportModalOpen = false;
  isMidiExportModalOpen = false;
  minHistoryLength: number = 0;

  constructor(@Inject(IManageBeatsToken) private readonly _beatsManager: IManageBeats,
    @Inject(AUDIO_ENGINE) public readonly soundService: IAudioEngine,
    @Inject(AUDIO_EXPORT) public readonly audioExportAdapter: IAudioExport,
    @Inject(IMIDI) public readonly midiExportService: IMidi,
    protected readonly tempoService: TempoAdapterService,
    private readonly playerEvents: PlayerEventsService,
    public readonly sequencerService: SequencerService,
    private readonly cdr: ChangeDetectorRef) {
    this.beatBehaviourSubject = new Subject<Beat>();

    this.playerEvents.playPause$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.soundService.playPause());
  }

  ngOnInit() {
    this.sequencerService.state$.pipe(
      tap(state => {
        if (state) {
          if (state.tempo) {
            this.tempoService.setBpm(BPM(state.tempo));
          }

          if (state.genre) {
            this.beats = this.genres.get(state.genre)?.map(b => b.label) ?? [];

            const beat = state.beat
              ? this.genres.get(state.genre)?.find(b => b.label === state.beat)
              : undefined;
            if (beat) {
              this._applyBeat(beat);
            } else {
              const firstBeat = this.genres.get(state.genre)?.[0];
              if (firstBeat) this._applyBeat(firstBeat);
            }
          }
          this.cdr.markForCheck();
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    this.beatBehaviourSubject.pipe(
      tap(beat => {
        this.tempoService.setNumberOfSteps(beat.tracks[0].numberOfSteps);
        this.soundService.setTracks(beat.tracks);
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    this._beatsManager.getAllBeats().then(beats => {
      const genreMap = new Map<string, Beat[]>();

      for (const beat of beats) {
        const existing = genreMap.get(beat.genre);
        if (existing)
          existing.push(beat);
        else
          genreMap.set(beat.genre, [beat]);
      }

      this.genres = genreMap;
      this.genresLabel = [...genreMap.keys()];
      const firstBeat = beats[0];
      if (firstBeat) {
        this.sequencerService.dispatch({ type: 'SELECT_BEAT', payload: { genre: firstBeat.genre, beat: firstBeat.label, tempo: firstBeat.bpm } });
        this.minHistoryLength = this.sequencerService.state$.getValue()?.historyLength ?? 0;
      }
      this.cdr.markForCheck();
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
    const firstBeat = this.genres.get(genre)?.[0];
    this.sequencerService.dispatch({ type: 'SELECT_BEAT', payload: { genre, beat: firstBeat!.label, tempo: firstBeat!.bpm } });
  }

  selectBeat(beatToSelect: Beat): void {
    this.sequencerService.dispatch({ type: 'SELECT_BEAT', payload: { genre: beatToSelect.genre, beat: beatToSelect.label, tempo: beatToSelect.bpm } });
  }

  beatChange($event: string) {
    const beatToSelect = this.genres.get(this.sequencerService.vm$.getValue().genre)?.find(x => x.label === $event);
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
    this.sequencerService.dispatch({ type: 'SET_TEMPO', payload: { tempo: $event } });
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
