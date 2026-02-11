import {SequencerComponent} from "./sequencer.component";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {provideRouter} from "@angular/router";
import {provideHttpClient} from "@angular/common/http";
import {By} from "@angular/platform-browser";
import {IManageBeatsToken} from "../../../infrastructure/injection-tokens/i-manage-beat.token";
import {AUDIO_ENGINE} from "../../../infrastructure/injection-tokens/audio-engine.token";
import {BreakpointObserver} from "@angular/cdk/layout";
import {MockBreakpointObserver} from "../../../core/testing/mock-breakpoint-observer";
import {
  AudioEngineAdapterFake
} from "../../../infrastructure/adapters/secondary/audio-engine/audio-engine.adapter.fake";
import IManageBeats from "../../../core/domain/ports/secondary/i-manage-beats";
import {Beat} from "../../../core/domain/beat";
import {Track} from "../../../core/domain/track";
import {Steps} from "../../../core/domain/steps";
import {NumberOfSteps} from "../../../core/domain/numberOfSteps";
import {BPM} from "../../../core/domain/bpm";
import {translateServiceMock} from "../../../core/testing/translate-service.mock";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {TranslatePipeMock} from "../../../core/testing/translate-pipe.mock";

describe('SequencerComponent', () => {
  let fixture: ComponentFixture<SequencerComponent>;
  let component: SequencerComponent;
  let mockBreakpointObserver: MockBreakpointObserver;

  beforeEach(async () => {
    mockBreakpointObserver = new MockBreakpointObserver();

    const beatsMock: IManageBeats = {
      getAllBeats(): Promise<readonly Beat[]> {
        return Promise.resolve([
          {
            "label": "4 on the floor",
            "genre": "Techno",
            "bpm": BPM(128),
            "tracks": [
              {
                "name": "Snare",
                "fileName": "metal/snare.mp3",
                "steps": new Steps([true, false, false, false]),
                "numberOfSteps": NumberOfSteps.sixteen
              }
            ] as ReadonlyArray<Track>
          } as Beat
        ]);
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        SequencerComponent,
      ],
      providers: [
        { provide: IManageBeatsToken, useValue: beatsMock },
        { provide: AUDIO_ENGINE, useClass: AudioEngineAdapterFake },
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
        { provide: TranslateService, useValue: translateServiceMock },
        provideHttpClient(),
        provideRouter([])
      ]
    }).overrideComponent(SequencerComponent, {
      remove: { imports: [TranslateModule] },
      add: { imports: [TranslatePipeMock] }
    }).compileComponents();

    fixture = TestBed.createComponent(SequencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it("default genre and beat are selected", () => {
    fixture.detectChanges();
    expect(component.selectedGenreLabel).toBe("Techno");
    expect(component.beat.label).toBe("4 on the floor");
  });

  it("should display a step button", () => {
    fixture.detectChanges();

    const stepButtons = fixture.debugElement.queryAll(By.css('button.step'));
    const numberOfActiveStepsBeforeClick = stepButtons.filter(btn =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      btn.nativeElement.classList.contains('active')
    ).length;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    stepButtons[0].nativeElement.click()

    fixture.detectChanges();

    const numberOfActiveStepsAfterClick = fixture.debugElement.queryAll(By.css('button.step')).filter(btn =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      btn.nativeElement.classList.contains('active')
    ).length;

    expect(numberOfActiveStepsBeforeClick).not.toEqual(numberOfActiveStepsAfterClick);
  });
})
