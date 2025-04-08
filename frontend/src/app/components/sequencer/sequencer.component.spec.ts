import {SequencerComponent} from "./sequencer.component";
import {ComponentFixture, fakeAsync, TestBed, tick} from "@angular/core/testing";
import {IManageBeatsToken} from "../../domain/ports/secondary/i-manage-beats";
import {InMemoryBeatGateway} from "../../adapters/secondary/in-memory-beat-gateway";
import {provideRouter} from "@angular/router";
import {provideHttpClient} from "@angular/common/http";

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
    const tapTempoButton = buttons[buttons.length - 1];

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
  }));
})
