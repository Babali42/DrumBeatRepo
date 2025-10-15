import {SequencerComponent} from "./sequencer.component";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {InMemoryBeatGateway} from "../../adapters/secondary/in-memory-beat-gateway";
import {provideRouter} from "@angular/router";
import {provideHttpClient} from "@angular/common/http";
import {By} from "@angular/platform-browser";
import {IManageBeatsToken} from "../../infrastructure/injection-tokens/i-manage-beat.token";
import {AUDIO_ENGINE} from "../../infrastructure/injection-tokens/audio-engine.token";
import {Bpm} from "../../domain/bpm";
import {Beat} from "../../domain/beat";
import {Track} from "../../domain/track";
import {BreakpointObserver} from "@angular/cdk/layout";
import {MockBreakpointObserver} from "../../testing/mock-breakpoint-observer";
import {SoundServiceFake} from "../../adapters/secondary/sound/sound.service.fake";

describe('SequencerComponent', () => {
  let fixture: ComponentFixture<SequencerComponent>;
  let component: SequencerComponent;
  let mockBreakpointObserver: MockBreakpointObserver;

  beforeEach(async () => {
    mockBreakpointObserver = new MockBreakpointObserver();

    await TestBed.configureTestingModule({
      imports: [SequencerComponent],
      providers: [
        {provide: IManageBeatsToken, useClass: InMemoryBeatGateway},
        {provide: AUDIO_ENGINE, useClass: SoundServiceFake},
        {provide: BreakpointObserver, useValue: mockBreakpointObserver},
        provideHttpClient(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SequencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
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

  it("should update uri field after user change a beat", () => {
    mockBreakpointObserver.setMatches(true);
    fixture.detectChanges();

    // eslint-disable-next-line
    const textarea = fixture.nativeElement.querySelector('textarea');
    // eslint-disable-next-line
    const firstValue = textarea.value;

    const stepButtons = fixture.debugElement.queryAll(By.css('button.step'));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    stepButtons[0].nativeElement.click()

    fixture.detectChanges();

    // eslint-disable-next-line
    let querySelector = fixture.nativeElement.querySelector('textarea');
    // eslint-disable-next-line
    expect(querySelector.value).not.toEqual(firstValue);
    // eslint-disable-next-line
    expect(querySelector.value).toContain('#')
  });

  it("should generate custom url", () => {
    const beat = {
      bpm: new Bpm(200),
      id: "test",
      label: "Techno",
      tracks: [
        new Track("test", "test", [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false])
      ],
    } as unknown as Beat;
    component.selectBeat(beat);
    component.customBeatUrl$.subscribe(beatUrl => {
      expect(beatUrl).not.toContain(" ");
      expect(beatUrl).toContain("200");
      expect(beatUrl).toContain("Sort%20Of%20Techno");
    });
  });
})
