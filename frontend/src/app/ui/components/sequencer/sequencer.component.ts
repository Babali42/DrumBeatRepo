import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { NgClass, NgOptimizedImage } from '@angular/common';

import { BPM } from '../../../domain/bpm';
import { Beat } from '../../../domain/beat';
import { AudioExportOptions } from '../../../domain/export-options/audio-export-options';
import { MidiExportOptions } from '../../../domain/export-options/midi-export-options';

import { NumberOfSteps } from '../../../domain/number-of-steps';
import { Track } from '../../../domain/track';
import { IAudioEngine } from '../../../domain/ports/i-audio-engine';
import { IAudioExport } from '../../../domain/ports/i-audio-export';
import { IMidi } from '../../../domain/ports/i-midi';

import { AUDIO_ENGINE } from '../../../infrastructure/injection-tokens/audio-engine.token';
import { AUDIO_EXPORT } from '../../../infrastructure/injection-tokens/audio-export.token';
import { IMIDI } from '../../../infrastructure/injection-tokens/i-midi.token';
import { downloadBlob } from '../../../infrastructure/adapters/utils/blob.utils';
import { TempoAdapterService } from '../../../infrastructure/adapters/tempo-control/tempo-adapter.service';

import { PlayerEventsService } from '../../services/space-bar-behaviour/player.events.service';
import { DrumImagePipe } from '../../pipes/drum-image.pipe';
import { IconDarkModePipe } from '../../pipes/icon-dark-mode.pipe';

import { BpmInputComponent } from '../bpm-input/bpm-input.component';
import { SelectInputComponent } from '../select-input/select-input.component';
import { ExportAudioModalComponent } from '../modals/export-audio-modal/export-audio-modal.component';
import { ExportMidiModalComponent } from '../modals/export-midi-modal/export-midi-modal.component';
import { BrowseAudioSamplesModalComponent } from '../modals/browse-audio-samples-modal/browse-audio-samples-modal.component';

import { SequencerService } from '../../services/sequencer/sequencer.service';
import { BeatMetadata } from '../../services/sequencer/beats-manifest';

@Component({
  selector: 'sequencer',
  standalone: true,
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss'],
  imports: [BpmInputComponent, SelectInputComponent, FormsModule, TranslatePipe, ExportAudioModalComponent, ExportMidiModalComponent, BrowseAudioSamplesModalComponent, NgOptimizedImage, DrumImagePipe, IconDarkModePipe, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SequencerComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  protected readonly Math = Math;
  protected readonly NumberOfSteps = NumberOfSteps;
  protected readonly AddTrackFeatureToggle = false;

  //do not undo the state inits
  readonly minHistoryLength = 1;

  beat = {} as Beat;

  isAudioExportModalOpen = false;
  isMidiExportModalOpen = false;
  isBrowseAudioSamplesModalOpen = false;

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

          const beatMeta =
            this.sequencerService.genres
              .get(state.genre)
              ?.find(x => x.label === state.beat);

          if (beatMeta) {
            if (this.beat.genre === state.genre && this.beat.label === state.beat) {
              this._applySteps();
            } else {
              this._applyBeat(beatMeta, state.genre, state.tempo);
            }
          }

          this.cdr.markForCheck();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    void this.sequencerService.initialize();
    const firstGenre = this.sequencerService.genresLabel[0];
    if (firstGenre) {
      this.genreChange(firstGenre);
    }
  }

  private _applyBeat(beatMeta: BeatMetadata, stateGenre: string, stateTempo: number): void {
    // guard if vm$.getValue().tracks is not yet set
    const vmTracks = this.sequencerService.vm$.getValue().tracks ?? [];

    this.beat = {
      genre: stateGenre,
      label: beatMeta.label,
      bpm: BPM(beatMeta.bpm ?? stateTempo),
      tracks: vmTracks,
      beatsPerBar: 4,
      subdivisionsPerBeat: 4,
      numberOfBar: 1
    };

    /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
    const firstTrack = vmTracks[0] as any; // use vmTracks not this.beat.tracks
    const steps = firstTrack?.steps?.length ?? firstTrack?.steps?.steps?.length ?? NumberOfSteps.sixteen;
    this.tempoService.numberOfSteps = steps;
    /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

    this.soundService.setTracks(this.beat.tracks);
  }

  private _applySteps(): void {
    const vmTracks = this.sequencerService.vm$.getValue().tracks;
    this.soundService.syncTracks(vmTracks);
    this.beat = { ...this.beat, tracks: vmTracks };
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

    const currentTempo = this.sequencerService.vm$.getValue().tempo || beatToSelect.bpm || 120;
    void this.sequencerService.dispatch({ 
      type: 'SELECT_BEAT', 
      payload: { 
        genre: beatToSelect.genre, 
        beat: beatToSelect.label, 
        tempo: currentTempo 
      } 
    });
  }

  dragState: { readonly trackName: string; readonly from: number; readonly to: number; readonly value: boolean } | null = null;

  onStepMouseDown(track: Track, stepIndex: number): void {
    this.dragState = {
      trackName: track.name,
      from: stepIndex,
      to: stepIndex,
      value: track.steps.getStepAtIndex(stepIndex),
    };
  }

  onStepMouseEnter(trackName: string, stepIndex: number): void {
    if (!this.dragState || this.dragState.trackName !== trackName) return;
    this.dragState = { ...this.dragState, to: stepIndex };
    this.cdr.markForCheck();
  }

  onStepMouseUp(_trackName: string, stepIndex: number): void {
    if (!this.dragState) return;

    const from = Math.min(this.dragState.from, stepIndex);
    const to = Math.max(this.dragState.from, stepIndex);
    this._dispatchDrag(from, to, this.dragState.trackName);
    this.dragState = null;
    this.cdr.markForCheck();
  }

  @HostListener('document:mouseup')
  private onDocumentMouseUp(): void {
    if (!this.dragState) return;
    const from = Math.min(this.dragState.from, this.dragState.to);
    const to = Math.max(this.dragState.from, this.dragState.to);
    this._dispatchDrag(from, to, this.dragState.trackName);
    this.dragState = null;
    this.cdr.markForCheck();
  }

  private _dispatchDrag(from: number, to: number, trackName: string): void {
    if (from === to) {
      void this.sequencerService.dispatch({
        type: 'TOGGLE_STEP',
        payload: { trackName, stepIndex: from },
      });
    } else {
      void this.sequencerService.dispatch({
        type: 'SET_STEPS',
        payload: { trackName, fromStepIndex: from, toStepIndex: to, velocity: !this.dragState!.value },
      });
    }
  }

  private _isInDragRange(trackName: string, stepIndex: number): boolean {
    if (!this.dragState || this.dragState.trackName !== trackName) return false;
    const from = Math.min(this.dragState.from, this.dragState.to);
    const to = Math.max(this.dragState.from, this.dragState.to);
    return stepIndex >= from && stepIndex <= to;
  }

  isInDragRange(trackName: string, stepIndex: number): boolean {
    return this._isInDragRange(trackName, stepIndex);
  }

  getStepActive(trackName: string, stepIndex: number, actualValue: boolean): boolean {
    if (!this._isInDragRange(trackName, stepIndex)) return actualValue;
    return !this.dragState!.value;
  }

  changeBeatBpm($event: number): void {
    this.soundService.pause();
    void this.sequencerService.dispatch({ type: 'SET_TEMPO', payload: { tempo: $event } });
  }

  addTrack(): void {
    this.isBrowseAudioSamplesModalOpen = true;
  }

  toggleMuteTrack = (trackName: string) => void this.sequencerService.dispatch({ type: 'TOGGLE_MUTE_TRACK', payload: { trackName } });

  async onAudioExport(options: AudioExportOptions): Promise<void> {
    this.isAudioExportModalOpen = false;

    try {
      const blob = await this.audioExportAdapter.exportBeat(
        this.beat.tracks,
        options
      );

      downloadBlob(blob, options.filename);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }

  async onMidiExport(options: MidiExportOptions): Promise<void> {
    this.isMidiExportModalOpen = false;

    try {
      const blob = await this.midiExportService.exportBeat(this.beat);

      downloadBlob(blob, options.filename);
    } catch (error) {
      console.error('Midi export failed:', error);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}