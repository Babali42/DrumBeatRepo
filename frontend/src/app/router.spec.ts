import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
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

const beatsProvider = {
  provide: IManageBeatsToken,
  useFactory: (inMemoryBeatGateway: InMemoryBeatGateway, beatsAdapterService: BeatsAdapterService) => {
    return environment.httpClientInMemory ? inMemoryBeatGateway : beatsAdapterService;
  },
  deps: [InMemoryBeatGateway, BeatsAdapterService]
};


describe('Router', () => {
  let router: Router;
  let location: Location;
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
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(AppComponent);

    const app = fixture.componentInstance;
    app.isMobileDisplay = true;
    app.isLandscape = true;
    app.isPortrait = false; // optional, just for clarity
  });

  it('should render default techno beat page', fakeAsync (() => {
    //Arrange
    router.initialNavigation();
    tick();

    //Act
    fixture.detectChanges();

    //Assert
    const dbg = fixture.debugElement.query(By.directive(SequencerComponent));
    expect(dbg).withContext('SequencerComponent should be in the DOM').toBeTruthy();

    const seq = dbg!.componentInstance as SequencerComponent;

    fixture.detectChanges();
    tick(); // Give the subscription time to emit and assign values
    fixture.detectChanges();

    expect(seq.beat).withContext('Beat object should have been set').toBeDefined();
    expect(seq.beat.bpm).toBe(128);
  }));

  it('should render the add beat page', fakeAsync (() => {
    //Act
    router.navigate(['/add-beat'],
      { queryParams: { beat: 'JTdCJTIyaWQlMjIlM0ElMjJkdWIlMjIlMkMlMjJsYWJlbCUyMiUzQSUyMkR1YiUyMiUyQyUyMmJwbSUyMiUzQTE0MCUyQyUyMmdlbnJlJTIyJTNBJTIyRHViJTIyJTJDJTIydHJhY2tzJTIyJTNBJTVCJTdCJTIybmFtZSUyMiUzQSUyMktpY2slMjIlMkMlMjJmaWxlTmFtZSUyMiUzQSUyMmR1YiUyRmtpY2sud2F2JTIyJTJDJTIyc3RlcHMlMjIlM0ElMjJYX19fX19fX1hfX19fX19fWF9fX19fX19YX19fX19fX1hfX19fX19fWF9fX19fX19YX19fX19fX1hfX19fX19fJTIyJTdEJTJDJTdCJTIybmFtZSUyMiUzQSUyMlN1YiUyMEJhc3MlMjIlMkMlMjJmaWxlTmFtZSUyMiUzQSUyMmR1YiUyRnN1Yi53YXYlMjIlMkMlMjJzdGVwcyUyMiUzQSUyMlglMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjBYJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwWCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMFglMjAlMjAlMjAlMjAlMjAlMjAlMjBYJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIyJTdEJTJDJTdCJTIybmFtZSUyMiUzQSUyMlNrYW5rJTIyJTJDJTIyZmlsZU5hbWUlMjIlM0ElMjJkdWIlMkZza2Fuay53YXYlMjIlMkMlMjJzdGVwcyUyMiUzQSUyMl9fX19YX19fX19fX1hfX19fX19fWF9fX19fX19YX19fX19fX1hfX19fX19fWF9fX19fX19YX19fX19fX1hfX18lMjIlN0QlMkMlN0IlMjJuYW1lJTIyJTNBJTIyU25hcmUlMjIlMkMlMjJmaWxlTmFtZSUyMiUzQSUyMmR1YiUyRnNuYXJlLndhdiUyMiUyQyUyMnN0ZXBzJTIyJTNBJTIyJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwWCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMFglMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjBYJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwWCUyMFglMjAlMjAlMjAlMjAlMjAlMjIlN0QlMkMlN0IlMjJuYW1lJTIyJTNBJTIyQXJwZWdnaW8lMjIlMkMlMjJmaWxlTmFtZSUyMiUzQSUyMmR1YiUyRmFycGVnZ2lvX3NpLndhdiUyMiUyQyUyMnN0ZXBzJTIyJTNBJTIyX19fX1hfX19fX19fWF9fX19fX19YX19fX19fX1hfX19fX19fWF9fX19fX19YX19fX19fX1hfX19fX19fWF9fXyUyMiU3RCUyQyU3QiUyMm5hbWUlMjIlM0ElMjJDbG9zZWQlMjBIYXQlMjIlMkMlMjJmaWxlTmFtZSUyMiUzQSUyMmR1YiUyRmNsb3NlZC1oYXQud2F2JTIyJTJDJTIyc3RlcHMlMjIlM0ElMjIlMjAlMjAlMjAlMjBYJTIwWCUyMCUyMCUyMCUyMCUyMFglMjAlMjAlMjAlMjAlMjAlMjAlMjBYWFglMjAlMjAlMjAlMjAlMjBYJTIwJTIwJTIwJTIwJTIwJTIwJTIwWCUyMFglMjAlMjAlMjAlMjAlMjBYWCUyMCUyMCUyMCUyMCUyMCUyMFglMjBYJTIwJTIwJTIwJTIwJTIwWCUyMFhYJTIyJTdEJTJDJTdCJTIybmFtZSUyMiUzQSUyMkJhc3MlMjIlMkMlMjJmaWxlTmFtZSUyMiUzQSUyMmR1YiUyRmJhc3Mud2F2JTIyJTJDJTIyc3RlcHMlMjIlM0ElMjJYJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwWCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMiU3RCU1RCU3RA==' }});
    tick();

    //Act
    fixture.detectChanges();

    //Assert
    const dbg = fixture.debugElement.query(By.directive(SequencerComponent));
    expect(dbg).withContext('SequencerComponent should be in the DOM').toBeTruthy();

    const seq = dbg!.componentInstance as SequencerComponent;

    fixture.detectChanges();
    tick(); // Give the subscription time to emit and assign values
    fixture.detectChanges();

    expect(seq.beat).withContext('Beat object should have been set').toBeDefined();
    expect(seq.beat.bpm).toBe(128);
  }));
});
