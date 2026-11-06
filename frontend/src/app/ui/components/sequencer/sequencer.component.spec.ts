import { SequencerComponent } from './sequencer.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { AUDIO_ENGINE } from '../../../infrastructure/injection-tokens/audio-engine.token';
import {
  AudioEngineAdapterFake
} from '../../../infrastructure/adapters/audio-engine/audio-engine.adapter.fake';
import { provideTranslateService } from '@ngx-translate/core';
import { IMIDI } from '../../../infrastructure/injection-tokens/i-midi.token';
import { MidiExportService } from '../../../infrastructure/adapters/midi-export/midi-exporter.service';
import { AUDIO_EXPORT } from '../../../infrastructure/injection-tokens/audio-export.token';
import { AudioExportAdapter } from '../../../infrastructure/adapters/audio-export/audio-export.adapter';
import { MidiExportOptions } from '../../../domain/export-options/midi-export-options';
import { AudioExportOptions } from '../../../domain/export-options/audio-export-options';
import { SequencerService } from '../../services/sequencer/sequencer.service';
import { BeatMetadata } from 'src/types/engine';
import { toMidiFilename } from '../../../domain/filenames/midi.filename';

declare let SequencerEngine: any;
declare let BeatLibrary: any;

describe('SequencerComponent', () => {
  let fixture: ComponentFixture<SequencerComponent>;
  let component: SequencerComponent;
  let service: SequencerService;

  const beatMetaData: BeatMetadata = { label: '4 on the floor', genre: 'Techno', filename: 'techno/techno' };
  const secondBeatMetaData: BeatMetadata = { label: 'OffBeat clap', genre: 'Techno', filename: 'techno/off-beat-clap' };

  beforeEach(async () => {
    spyOn(BeatLibrary, 'loadBeatsManifest').and.returnValue(
      Promise.resolve([
        beatMetaData,
        secondBeatMetaData
      ])
    );

    SequencerEngine.reset();

    await TestBed.configureTestingModule({
      imports: [SequencerComponent],
      providers: [
        { provide: AUDIO_ENGINE, useClass: AudioEngineAdapterFake },
        { provide: AUDIO_EXPORT, useClass: AudioExportAdapter },
        { provide: IMIDI, useClass: MidiExportService },
        provideTranslateService({
          lang: 'en',
          fallbackLang: 'en'
        }),
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SequencerComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(SequencerService);

    // AppComponent owns the library bootstrap now, so the test has to arrange it
    await service.initialize();
    await service.dispatch({
      type: 'SELECT_BEAT',
      payload: { filename: beatMetaData.filename }
    });

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle a step when clicked', async () => {
    const dispatch = spyOn(service, 'dispatch').and.callThrough();
    let stepButtons = fixture.debugElement.queryAll(By.css('button.step'));
    const firstInactiveStep = component.beat.tracks[0].steps.steps.findIndex(step => !step);
    const stepButton = stepButtons[firstInactiveStep];

    expect(stepButton.nativeElement.classList.contains('active')).toBeFalse();

    stepButton.nativeElement.dispatchEvent(new MouseEvent('mousedown'));
    stepButton.nativeElement.dispatchEvent(new MouseEvent('mouseup'));

    await dispatch.calls.mostRecent().returnValue;
    fixture.detectChanges();

    stepButtons = fixture.debugElement.queryAll(By.css('button.step'));

    expect(stepButtons[firstInactiveStep].nativeElement.classList.contains('active')).toBeTrue();
  });

  it('step change should not be kept in memory after selected beat change', async () => {
    const dispatch = spyOn(service, 'dispatch').and.callThrough();
    const initialSteps = [...component.beat.tracks[0].steps.steps];

    for (let i = 0; i < 4; i++) {
      const stepButtons = fixture.debugElement.queryAll(By.css('button.step'));
      stepButtons[i].nativeElement.dispatchEvent(new MouseEvent('mousedown'));
      stepButtons[i].nativeElement.dispatchEvent(new MouseEvent('mouseup'));
      await dispatch.calls.mostRecent().returnValue;
      fixture.detectChanges();
    }

    expect(component.beat.tracks[0].steps.steps.slice(0, 4)).not.toEqual(initialSteps.slice(0, 4));

    await service.dispatch({ type: 'SELECT_BEAT', payload: { filename: secondBeatMetaData.filename } });
    await fixture.whenStable();
    fixture.detectChanges();

    await service.dispatch({ type: 'SELECT_BEAT', payload: { filename: beatMetaData.filename } });
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.beat.tracks[0].steps.steps).toEqual(initialSteps);
  });

  it('should apply the range change when mouseup happens outside the grid', async () => {
    const dispatch = spyOn(service, 'dispatch').and.callThrough();
    const track = component.beat.tracks[0];
    const fromStep = track.steps.steps.slice(0, 4).findIndex(step => !step);

    component.onStepMouseDown(track, fromStep);
    component.onStepMouseEnter(track.name, 0);
    component.onStepMouseEnter(track.name, 2);
    component.onStepMouseEnter(track.name, 3);

    document.dispatchEvent(new MouseEvent('mouseup'));

    await dispatch.calls.mostRecent().returnValue;
    fixture.detectChanges();

    const stepButtons = fixture.debugElement.queryAll(By.css('button.step'));

    expect(
      stepButtons[0].nativeElement.classList.contains('active')
    ).toBeTrue();

    expect(
      stepButtons[1].nativeElement.classList.contains('active')
    ).toBeTrue();

    expect(
      stepButtons[2].nativeElement.classList.contains('active')
    ).toBeTrue();

    expect(
      stepButtons[3].nativeElement.classList.contains('active')
    ).toBeTrue();
  });

  it('Should call export midi service on modal validation', async () => {
    spyOn(URL, 'createObjectURL').and.returnValue('blob:test');
    spyOn(URL, 'revokeObjectURL');

    const spy = spyOn(
      component.midiExportService,
      'exportBeat'
    ).and.resolveTo(new Blob());

    await component.onMidiExport({ filename: toMidiFilename('test.mid') } as MidiExportOptions);

    expect(spy).toHaveBeenCalled();
  });

  it('Should call export audio adapter on modal validation', async () => {
    spyOn(URL, 'createObjectURL').and.returnValue('blob:test');
    spyOn(URL, 'revokeObjectURL');

    const spy = spyOn(
      component.audioExportAdapter,
      'exportBeat'
    ).and.resolveTo(new Blob());

    await component.onAudioExport({
      filename: 'test.wav',
      loopCount: 1,
      exportWithTail: false
    } as AudioExportOptions);

    expect(spy).toHaveBeenCalled();
  });

  it('Should disable the undo button when there is no command history', () => {
    const undoButton = fixture.debugElement.query(
      By.css('button.undo')
    );

    expect(undoButton).toBeTruthy();
    expect(undoButton.nativeElement.disabled).toBeTrue();
  });

  it('Should enable the undo button when past commands have been done', async () => {
    await service.dispatch({
      type: 'SELECT_BEAT',
      payload: {
        filename: secondBeatMetaData.filename
      }
    });

    await fixture.whenStable();
    fixture.detectChanges();

    const undoButton = fixture.debugElement.query(
      By.css('button.undo')
    );

    expect(undoButton).toBeTruthy();
    expect(undoButton.nativeElement.disabled).toBeFalse();
  });

  it('Should disable the redo button when there are no future commands to apply', () => {
    const redoButton = fixture.debugElement.query(
      By.css('button.redo')
    );

    expect(redoButton).toBeTruthy();
    expect(redoButton.nativeElement.disabled).toBeTrue();
  });

  it('Should enable the redo button when there are future commands to apply', async () => {
    await service.dispatch({
      type: 'SELECT_BEAT',
      payload: {
        filename: secondBeatMetaData.filename,
      }
    });

    await service.dispatch({
      type: 'UNDO'
    });

    await fixture.whenStable();
    fixture.detectChanges();

    const redoButton = fixture.debugElement.query(
      By.css('button.redo')
    );

    expect(redoButton).toBeTruthy();
    expect(redoButton.nativeElement.disabled).toBeFalse();
  });

  describe('play and pause buttons', () => {
    const fullStrengthColor = 'rgb(0, 0, 0)';
    const root = document.documentElement;

    const desktopButton = (): HTMLButtonElement =>
      fixture.debugElement.query(By.css('button.play-pause-button')).nativeElement;
    const mobileButton = (): HTMLButtonElement =>
      fixture.debugElement.query(By.css('button.mobile-play-button')).nativeElement;

    beforeEach(() => {
      root.style.setProperty('--textColor', fullStrengthColor);
      root.style.setProperty('--backgroundColor', 'rgb(255, 255, 255)');
      root.style.setProperty('--borderColor', fullStrengthColor);
      fixture.detectChanges();
    });

    afterEach(() => {
      root.style.removeProperty('--textColor');
      root.style.removeProperty('--backgroundColor');
      root.style.removeProperty('--borderColor');
    });

    it('Should give the desktop play button a soft border like the close button', () => {
      expect(getComputedStyle(desktopButton()).borderTopColor).not.toBe(fullStrengthColor);
    });

    it('Should give the mobile play button a soft border like the close button', () => {
      expect(getComputedStyle(mobileButton()).borderTopColor).not.toBe(fullStrengthColor);
    });

    it('Should show a solid focus outline on the mobile play button like the close button', () => {
      const button = mobileButton();

      // The mobile button is hidden above 1280px, and a hidden button can't take focus.
      button.style.display = 'flex';
      button.focus();
      fixture.detectChanges();

      const style = getComputedStyle(button);
      expect(style.outlineStyle).toBe('solid');
      expect(style.outlineWidth).toBe('2px');
    });

    it('Should switch both buttons between Play and Pause when one is clicked', () => {
      expect(desktopButton().getAttribute('aria-label')).toBe('Play');
      expect(mobileButton().getAttribute('aria-label')).toBe('Play');

      desktopButton().click();
      fixture.detectChanges();

      expect(desktopButton().getAttribute('aria-label')).toBe('Pause');
      expect(mobileButton().getAttribute('aria-label')).toBe('Pause');

      mobileButton().click();
      fixture.detectChanges();

      expect(desktopButton().getAttribute('aria-label')).toBe('Play');
      expect(mobileButton().getAttribute('aria-label')).toBe('Play');
    });
  });
});
