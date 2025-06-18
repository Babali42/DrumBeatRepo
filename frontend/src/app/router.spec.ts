import {ComponentFixture, fakeAsync, flushMicrotasks, TestBed, tick} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {SequencerComponent} from "./components/sequencer/sequencer.component";
import {By} from "@angular/platform-browser";
import {AppComponent} from "./app.component";
import { LoadingBarModule } from '@ngx-loading-bar/core';
import {IManageBeatsToken} from "./infrastructure/injection-tokens/i-manage-beat.token";
import {InMemoryBeatGateway} from "./adapters/secondary/in-memory-beat-gateway";
import {BeatsAdapterService} from "./adapters/secondary/beats-adapter.service";
import {environment} from "../environments/environment";
import {routes} from "./app.module";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {AUDIO_ENGINE} from "./infrastructure/injection-tokens/audio-engine.token";
import {SoundService} from "./adapters/secondary/sound/sound.service";
import {Beat} from "./domain/beat";
import {CompactBeatMapper} from "./domain/compact-beat.mapper";
import {BeatUrlMapper} from "./adapters/secondary/beat-url.mapper";

const beatsProvider = {
  provide: IManageBeatsToken,
  useFactory: (inMemoryBeatGateway: InMemoryBeatGateway, beatsAdapterService: BeatsAdapterService) => {
    return environment.httpClientInMemory ? inMemoryBeatGateway : beatsAdapterService;
  },
  deps: [InMemoryBeatGateway, BeatsAdapterService]
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
        { provide: AUDIO_ENGINE, useClass: SoundService },
        provideHttpClient(withInterceptorsFromDi()),
        beatsProvider,
        BeatsAdapterService,
        InMemoryBeatGateway,
        {
          provide: IManageBeatsToken,
          useValue: {
            getBeatsGroupedByGenres: () => Promise.resolve([
              {
                label: 'House',
                beats: [{ label: 'Classic', bpm: 128, tracks: [{ steps: [0, 1, 0, 1] }] }]
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
    expect(seq.beat.bpm).toBe(128);
  }));

  it('should render the add beat page', fakeAsync (() => {
    const beat = { id: 'custom-beat', label: 'Custom', genre: 'customGenre', bpm: 180, tracks: [{ steps: [false, true, false, true], name: "kick", fileName: "techno/kick.mp3" }] } as Beat;
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
    expect(seq.beat.bpm).toBe(180);
  }));
});
