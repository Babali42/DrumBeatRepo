import { Option } from "effect";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Beat } from '../../../domain/beat';
import { Subject, takeUntil, tap } from "rxjs";
import { BpmInputComponent } from "../bpm-input/bpm-input.component";
import { SelectInputComponent } from "../select-input/select-input.component";
import { Track } from "../../../domain/track";
import { IAudioEngine } from "../../../domain/ports/i-audio-engine";
import { FormsModule } from "@angular/forms";
import { NumberOfSteps } from "../../../domain/number-of-steps";
import { TempoAdapterService } from "../../../infrastructure/adapters/tempo-control/tempo-adapter.service";
import { PlayerEventsService } from "../../services/player.events.service";
import { BPM } from "../../../domain/bpm";
import { StepIndex } from "../../../domain/step-index";
import { ExportAudioModalComponent } from "../modals/export-audio-modal/export-audio-modal.component";
import { AudioExportOptions } from "../../../domain/export-options/audio-export-options";
import { MaxMidiNote } from "../../../domain/midi-drum-type";
import { ExportMidiModalComponent } from "../modals/export-midi-modal/export-midi-modal.component";
import { MidiExportOptions } from "../../../domain/export-options/midi-export-options";
import { downloadBlob } from "../../../infrastructure/adapters/utils/blob.utils";
import { IMIDI } from "../../../infrastructure/injection-tokens/i-midi.token";
import { IMidi } from "../../../domain/ports/i-midi";
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
  private readonly destroy$ = new Subject<void>;
  protected readonly Math = Math;
  protected readonly NumberOfSteps = NumberOfSteps;
  protected readonly StepIndex = StepIndex;

  //do not undo the state inits
  readonly minHistoryLength = 1;

  beat = {} as Beat;

  isAudioExportModalOpen = false;
  isMidiExportModalOpen = false;
  
  constructor(@Inject(AUDIO_ENGINE) public readonly soundService: IAudioEngine,
    @Inject(AUDIO_EXPORT) public readonly audioExportAdapter: IAudioExport,
    @Inject(IMIDI) public readonly midiExportService: IMidi,
    protected readonly tempoService: TempoAdapterService,
    private readonly playerEvents: PlayerEventsService,
    public readonly sequencerService: SequencerService,
    private readonly cdr: ChangeDetectorRef) {

    this.playerEvents.playPause$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.soundService.playPause());
  }

  ngOnInit(): void {
    this.sequencerService.state$
      .pipe(
        tap(state => {
          if (!state)
            return;
          
          if (state.tempo) {
            this.tempoService.setBpm(BPM(state.tempo));
          }

          const beat =
            this.sequencerService.genres
              .get(state.genre)
              ?.find(x => x.label === state.beat);

          if (beat) {
            if (this.beat.genre === state.genre && this.beat.label === state.beat) {
              const vmTracks = this.sequencerService.vm$.getValue().tracks;
              const orderedTracks = [...vmTracks].sort((a: Track, b: Track) =>
                Option.getOrElse(b.midiNote, () => MaxMidiNote) - Option.getOrElse(a.midiNote, () => MaxMidiNote));
              this.soundService.syncTracks(orderedTracks);
              this.beat = { ...this.beat, tracks: orderedTracks };
              this.tempoService.setNumberOfSteps(this.beat.tracks[0]?.numberOfSteps);
            } else {
              this._applyBeat(beat);
            }
          }

          this.cdr.markForCheck();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.sequencerService.initialize().then(() => {
      const firstGenre = this.sequencerService.genresLabel[0];
      this.genreChange(firstGenre);
    }).catch(() => {
      console.error("Fail to init sequencer");
    });
  }

  private _applyBeat(beatToSelect: Beat): void {
    const vmTracks = this.sequencerService.vm$.getValue().tracks;
    const orderedTracks = [...vmTracks].sort((a: Track, b: Track) =>
      Option.getOrElse(b.midiNote, () => MaxMidiNote) - Option.getOrElse(a.midiNote, () => MaxMidiNote));

    this.beat = {
      ...beatToSelect,
      tracks: orderedTracks
    };

    this.tempoService.setNumberOfSteps(this.beat.tracks[0]?.numberOfSteps);
    this.soundService.setTracks(this.beat.tracks);
  }

  genreChange(genre: string): void {
    const beatsFromGenre = this.sequencerService.genres.get(genre);

    if (!beatsFromGenre)
      return;

    this.selectBeat(beatsFromGenre[0]);
  }

  beatChange(beat: string) {
    const beatsFromGenre = this.sequencerService.genres.get(this.sequencerService.vm$.getValue().genre);
    
    if(!beatsFromGenre)
      return;

    const beatToSelect = beatsFromGenre.find(x => x.label === beat);

    this.selectBeat(beatToSelect);
  }

  selectBeat(beatToSelect: Beat | undefined): void {
    if(!beatToSelect)
      return;

    this.sequencerService.dispatch({ type: 'SELECT_BEAT', payload: { genre: beatToSelect.genre, beat: beatToSelect.label, tempo: beatToSelect.bpm } });
  }

  stepClick = (track: Track, stepIndex: StepIndex): void => {
    this.sequencerService.dispatch({
      type: 'TOGGLE_STEP',
      payload: { trackName: track.name, stepIndex },
    });
  }

  changeBeatBpm($event: number) {
    this.soundService.pause();
    this.sequencerService.dispatch({ type: 'SET_TEMPO', payload: { tempo: $event } });
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
