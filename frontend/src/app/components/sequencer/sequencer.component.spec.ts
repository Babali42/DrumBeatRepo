import {SequencerComponent} from "./sequencer.component";
import {ComponentFixture, fakeAsync, TestBed, tick} from "@angular/core/testing";
import {IManageBeatsToken} from "../../domain/ports/secondary/i-manage-beats";
import {InMemoryBeatGateway} from "../../adapters/secondary/in-memory-beat-gateway";
import {ActivatedRoute, provideRouter} from "@angular/router";
import {provideHttpClient} from "@angular/common/http";
import {By} from "@angular/platform-browser";
import {BehaviorSubject, of} from "rxjs";

describe('SequencerComponent', () => {
  let fixture: ComponentFixture<SequencerComponent>;
  let component: SequencerComponent;
  let mockUrl$ = new BehaviorSubject([{ path: 'original' }]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SequencerComponent],
      providers: [
        {provide: IManageBeatsToken, useClass: InMemoryBeatGateway},
        {
          provide: ActivatedRoute,
          useValue: {
            url: mockUrl$.asObservable()
          }
        },
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

  it('should have <button> with "Tap tempo"', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const sequencerComponent: HTMLElement = fixture.nativeElement;
    const buttons = sequencerComponent.querySelectorAll('button');
    const p = buttons[buttons.length - 1];
    expect(p.textContent).toEqual('Tap tempo');
  });

  it('should update tempo after three tap tempo clicks', fakeAsync(() => {
    //Arrange
    fixture.detectChanges();

    // eslint-disable-next-line
    const sequencerComponent: HTMLElement = fixture.nativeElement;
    const buttons = sequencerComponent.querySelectorAll('button');
    const tapTempoButton = buttons[1];

    expect(tapTempoButton).toBeTruthy();

    //Act
    tapTempoButton.click();
    tick(300);
    tapTempoButton.click();
    tick(300);
    tapTempoButton.click();

    fixture.detectChanges();

    //Assert
    // eslint-disable-next-line
    const tempoInput = fixture.nativeElement.querySelector('input');
    // eslint-disable-next-line
    const tempoResult = parseInt(tempoInput.value, 10);
    expect(tempoResult).toBe(200);
  }))

  it("should display a step button", () => {
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

  it("should update uri after user change a beat", () => {
    fixture.detectChanges();

    let originalUrl = component.route.url;

    // simulate beat change in component
    mockUrl$.next([{ path: 'updated' }]);

    fixture.detectChanges();

    component.route.url.subscribe(url => {
      console.log(url);
      expect(url).not.toBe([]);
    });
  });
})
