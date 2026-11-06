import { AppComponent } from './app.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { BreakpointObserver } from '@angular/cdk/layout';
import { of } from 'rxjs';
import { provideTranslateService } from '@ngx-translate/core';
import { AUDIO_ENGINE } from '../infrastructure/injection-tokens/audio-engine.token';
import { AUDIO_EXPORT } from '../infrastructure/injection-tokens/audio-export.token';
import { IMIDI } from '../infrastructure/injection-tokens/i-midi.token';
import {
  AudioEngineAdapterFake
} from '../infrastructure/adapters/audio-engine/audio-engine.adapter.fake';
import { AudioExportAdapter } from '../infrastructure/adapters/audio-export/audio-export.adapter';
import { MidiExportService } from '../infrastructure/adapters/midi-export/midi-exporter.service';
import { SequencerService } from './services/sequencer/sequencer.service';
import { Command } from './services/sequencer/sequencer.command';
import { BeatMetadata } from 'src/types/engine';

declare let SequencerEngine: any;
declare let BeatLibrary: any;

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let service: SequencerService;

  const technoBeat: BeatMetadata = { label: 'techno', genre: 'techno', filename: 'techno.wav' };
  const secondTechnoBeat: BeatMetadata = { label: 'techno2', genre: 'techno', filename: 'techno2.wav' };
  const houseBeat: BeatMetadata = { label: 'house', genre: 'house', filename: 'house.wav' };

  beforeEach(async () => {
    spyOn(BeatLibrary, 'loadBeatsManifest').and.returnValue(
      Promise.resolve([technoBeat, secondTechnoBeat, houseBeat])
    );

    SequencerEngine.reset();

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: AUDIO_ENGINE, useClass: AudioEngineAdapterFake },
        { provide: AUDIO_EXPORT, useClass: AudioExportAdapter },
        { provide: IMIDI, useClass: MidiExportService },
        // force the desktop branch of the template, hidden on mobile by default
        { provide: BreakpointObserver, useValue: { observe: () => of({ matches: true, breakpoints: {} }) } },
        provideTranslateService({
          lang: 'en',
          fallbackLang: 'en'
        }),
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(SequencerService);

    spyOn(service, 'dispatch').and.callFake(async (command: Command) => {
      const payload = command.payload;
      if (command.type !== 'SELECT_BEAT' || typeof payload !== 'object' || payload === null || !('filename' in payload) || typeof payload.filename !== 'string') {
        return;
      }

      const selectedBeat = [...service.genres.values()]
        .flat()
        .find(beat => beat.filename === payload.filename);
      if (!selectedBeat) {
        return;
      }

      service.state$.next({
        beat: selectedBeat.label,
        genre: selectedBeat.genre,
        tracks: [],
        tempo: 128,
        beatsPerBar: 4,
        subdivisionsPerBeat: 4,
        numberOfBar: 1,
        historyLength: 0,
        futureLength: 0
      });
    });

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the genre select and the beat select', () => {
    const selects = fixture.debugElement.queryAll(By.css('app-select-input'));

    expect(selects.length).toBe(2);
  });

  it('should select the first genre of the library on init', async () => {
    const vm = service.vm$.getValue();

    expect(service.genresLabel[0]).toBe(technoBeat.genre);
    expect(vm.genre).toEqual(technoBeat.genre);
    expect(vm.beat).toEqual(technoBeat.label);
  });

  it('should select the first beat of the genre when the genre changes', async () => {
    await component.genreChange(houseBeat.genre);

    const vm = service.vm$.getValue();

    expect(vm.genre).toEqual(houseBeat.genre);
    expect(vm.beat).toEqual(houseBeat.label);
  });

  it('should select the given beat when the beat changes', async () => {
    await component.beatChange(secondTechnoBeat.label);

    const vm = service.vm$.getValue();

    expect(vm.genre).toEqual(technoBeat.genre);
    expect(vm.beat).toEqual(secondTechnoBeat.label);
  });

  it('should keep the current beat when an unknown beat is given', async () => {
    await component.beatChange('does not exist');

    expect(service.vm$.getValue().beat).toEqual(technoBeat.label);
  });
});
