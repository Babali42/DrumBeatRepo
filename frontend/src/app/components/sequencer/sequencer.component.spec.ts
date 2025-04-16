import {SequencerComponent} from "./sequencer.component";
import {ComponentFixture, fakeAsync, TestBed, tick} from "@angular/core/testing";
import {IManageBeatsToken} from "../../domain/ports/secondary/i-manage-beats";
import {InMemoryBeatGateway} from "../../adapters/secondary/in-memory-beat-gateway";
import {provideRouter} from "@angular/router";
import {provideHttpClient} from "@angular/common/http";
import {By} from "@angular/platform-browser";

describe('SequencerComponent', () => {
  let fixture: ComponentFixture<SequencerComponent>;
  let component: SequencerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SequencerComponent],
      providers: [
        { provide: IManageBeatsToken, useClass: InMemoryBeatGateway },
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

  it("should display a step button", ()  => {
    fixture.detectChanges();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
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
