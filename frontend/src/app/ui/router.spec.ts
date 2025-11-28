import {ComponentFixture, fakeAsync, flushMicrotasks, TestBed, tick} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {SequencerComponent} from "./components/sequencer/sequencer.component";
import {By} from "@angular/platform-browser";
import {AppComponent} from "./app.component";
import { LoadingBarModule } from '@ngx-loading-bar/core';
import {IManageBeatsToken} from "../infrastructure/injection-tokens/i-manage-beat.token";
import {InMemoryBeatGateway} from "../infrastructure/adapters/secondary/beat-source/in-memory-beat-gateway";
import {routes} from "./app.module";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {AUDIO_ENGINE} from "../infrastructure/injection-tokens/audio-engine.token";
import {AudioEngineAdapter} from "../infrastructure/adapters/secondary/audio-engine/audio-engine.adapter";
import {Beat} from "../core/domain/beat";
import {CompactBeatMapper} from "../infrastructure/adapters/secondary/beat-source/compact-beat.mapper";
import {BeatUrlMapper} from "../infrastructure/adapters/secondary/beat-source/beat-url.mapper";
import {Bpm} from "../core/domain/bpm";
import {Track} from "../core/domain/track";

const beatsProvider = {
  provide: IManageBeatsToken,
  deps: [InMemoryBeatGateway]
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
      ],
      providers: [
        { provide: AUDIO_ENGINE, useClass: AudioEngineAdapter },
        provideHttpClient(withInterceptorsFromDi()),
        beatsProvider,
        InMemoryBeatGateway,
        {
          provide: IManageBeatsToken,
          useValue: {
            getAllBeats: () => Promise.resolve([
              {
                id: 'classic',
                label: 'Classic',
                bpm: new Bpm(128),
                tracks: [
                  new Track("","", [true, false, true, false])
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
    expect(seq.beat.bpm.value).toEqual(128);
  }));

  it('should render the add beat page', fakeAsync (() => {
    const beat = { id: 'custom-beat', label: 'Custom', genre: 'customGenre', bpm: new Bpm(128), tracks: [new Track("", "", [false, true, false, true])]} as Beat;
    const compactBeat = CompactBeatMapper.toCompactBeat(beat);
    const base64Beat = BeatUrlMapper.toBase64(compactBeat);

    router.navigate([], { queryParams: { beat: base64Beat, name: 'test', bpm: '230' } });
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
    expect(seq.beat.bpm.value).toEqual(128);
  }));
});
