import { AppComponent } from './app.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { BreakpointObserver } from '@angular/cdk/layout';
import { filter, firstValueFrom, of } from 'rxjs';
import { Effect, Option } from 'effect';
import { provideTranslateService } from '@ngx-translate/core';
import { IManageBeatsToken } from '../infrastructure/injection-tokens/i-manage-beat.token';
import { AUDIO_ENGINE } from '../infrastructure/injection-tokens/audio-engine.token';
import { AUDIO_EXPORT } from '../infrastructure/injection-tokens/audio-export.token';
import { IMIDI } from '../infrastructure/injection-tokens/i-midi.token';
import {
  AudioEngineAdapterFake
} from '../infrastructure/adapters/audio-engine/audio-engine.adapter.fake';
import { AudioExportAdapter } from '../infrastructure/adapters/audio-export/audio-export.adapter';
import { MidiExportService } from '../infrastructure/adapters/midi-export/midi-exporter.service';
import { SequencerService } from './services/sequencer/sequencer.service';
import { SequencerViewModel } from './components/sequencer/sequencer.viewmodel';
import { Beat } from '../domain/beat';
import { BPM } from '../domain/bpm';
import { Steps } from '../domain/steps';
import { MidiDrumType } from '../domain/midi-drum-type';

declare let SequencerEngine: any;
declare let BeatLibrary: any;

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let service: SequencerService;

  const technoBeat = { label: "techno", genre: "techno", filename: "techno" };
  const secondTechnoBeat = { label: "techno2", genre: "techno", filename: "techno" };
  const houseBeat = { label: "house", genre: "house", filename: "house" };

  // dispatch() is queued and resolves outside of Angular's zone, so whenStable()
  // is not enough : wait for the view model to carry the expected selection
  const waitForVm = (predicate: (vm: SequencerViewModel) => boolean): Promise<SequencerViewModel> =>
    firstValueFrom(service.vm$.pipe(filter(predicate)));

  beforeEach(async () => {
    spyOn(BeatLibrary, 'loadBeatsManifest').and.returnValue(
      Promise.resolve([technoBeat, secondTechnoBeat, houseBeat])
    );

    SequencerEngine.reset();

    const beatsMock = {
      getBeatByFileName: jasmine.createSpy('getBeatByFileName').and.returnValue(
        Effect.succeed({
          label: "techno",
          genre: "techno",
          bpm: BPM(128),
          beatsPerBar: 4,
          subdivisionsPerBeat: 4,
          numberOfBar: 1,
          tracks: [
            {
              name: 'Snare',
              filename: 'metal/snare.mp3',
              steps: new Steps([true, true, true, true]),
              isMuted: false,
              midiNote: Option.some(MidiDrumType.ACOUSTIC_SNARE)
            }
          ]
        } as Beat)
      )
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: IManageBeatsToken, useValue: beatsMock },
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
    const vm = await waitForVm(x => x.genre === technoBeat.genre);

    expect(vm.beat).toEqual(technoBeat.label);
  });

  it('should select the first beat of the genre when the genre changes', async () => {
    component.genreChange(houseBeat.genre);

    const vm = await waitForVm(x => x.genre === houseBeat.genre);

    expect(vm.beat).toEqual(houseBeat.label);
  });

  it('should select the given beat when the beat changes', async () => {
    component.beatChange(secondTechnoBeat.label);

    const vm = await waitForVm(x => x.beat === secondTechnoBeat.label);

    expect(vm.genre).toEqual(technoBeat.genre);
  });

  it('should keep the current beat when an unknown beat is given', async () => {
    await waitForVm(x => x.beat === technoBeat.label);

    component.beatChange('does not exist');

    expect(service.vm$.getValue().beat).toEqual(technoBeat.label);
  });
});
