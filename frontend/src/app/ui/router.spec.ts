import {ComponentFixture, fakeAsync, flushMicrotasks, TestBed, tick} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {SequencerComponent} from "./components/sequencer/sequencer.component";
import {By} from "@angular/platform-browser";
import {AppComponent} from "./app.component";
import { LoadingBarModule } from '@ngx-loading-bar/core';
import {IManageBeatsToken} from "../infrastructure/injection-tokens/i-manage-beat.token";
import {BeatAdapter} from "../infrastructure/adapters/secondary/beat-source/beat-adapter.service";
import {routes} from "./app.module";
import {AUDIO_ENGINE} from "../infrastructure/injection-tokens/audio-engine.token";
import {AudioEngineAdapter} from "../infrastructure/adapters/secondary/audio-engine/audio-engine.adapter";
import {Track} from "../core/domain/track";
import {BPM} from "../core/domain/bpm";
import {provideTranslateService} from "@ngx-translate/core";
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";
import {HttpClientTestingModule} from "@angular/common/http/testing";

const beatsProvider = {
  provide: IManageBeatsToken,
  deps: [BeatAdapter]
};

describe('Router', () => {
  let router: Router;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        RouterTestingModule.withRoutes(routes),
        SequencerComponent,
        LoadingBarModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AUDIO_ENGINE, useClass: AudioEngineAdapter },
        provideTranslateService({
          lang: 'fr',
          fallbackLang: 'en',
          loader: provideTranslateHttpLoader({
            prefix: './assets/i18n/',
            suffix: '.json'
          })
        }),
        beatsProvider,
        BeatAdapter,
        {
          provide: IManageBeatsToken,
          useValue: {
            getAllBeats: () => Promise.resolve([
              {
                id: 'classic',
                label: 'Classic',
                bpm: BPM(128),
                tracks: [
                  new Track("","", [true, false, true, false, true, false, true, false])
                ]
              }
            ])
          }
        }
      ]
    });

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AppComponent);

    const app = fixture.componentInstance;
    app.isMobileDisplay = true;
    app.isLandscape = true;
    app.isPortrait = false; // optional, just for clarity
  });

  it('should render the main page', fakeAsync (() => {
    router.initialNavigation();
    tick();

    flushMicrotasks();
    fixture.detectChanges();

    tick(); // simulate any pending async data (e.g., from `ngOnInit`)
    fixture.detectChanges();

    // 3) Assert
    const dbg = fixture.debugElement.query(By.directive(SequencerComponent));
    expect(dbg).withContext('SequencerComponent should be in the DOM').toBeTruthy();

    const seq = dbg.componentInstance as SequencerComponent;
    expect(seq.beat).withContext('Beat object should have been set').toBeDefined();
    expect(seq.beat.bpm.valueOf()).toEqual(128);
  }));
});
