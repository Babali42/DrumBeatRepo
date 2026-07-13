import { SequencerComponent } from "./sequencer.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { By } from "@angular/platform-browser";
import { IManageBeatsToken } from "../../../infrastructure/injection-tokens/i-manage-beat.token";
import { AUDIO_ENGINE } from "../../../infrastructure/injection-tokens/audio-engine.token";
import {
  AudioEngineAdapterFake
} from "../../../infrastructure/adapters/audio-engine/audio-engine.adapter.fake";
import IManageBeats from "../../../domain/ports/i-manage-beats";
import { Beat } from "../../../domain/beat";
import { Steps } from "../../../domain/steps";
import { NumberOfSteps } from "../../../domain/number-of-steps";
import { BPM } from "../../../domain/bpm";
import { MidiDrumType } from "../../../domain/midi-drum-type";
import { provideTranslateService } from "@ngx-translate/core";
import { Option } from "effect";
import { IMIDI } from "../../../infrastructure/injection-tokens/i-midi.token";
import { MidiExportService } from "../../../infrastructure/adapters/midi-export/midi-exporter.service";
import { AUDIO_EXPORT } from "../../../infrastructure/injection-tokens/audio-export.token";
import { AudioExportAdapter } from "../../../infrastructure/adapters/audio-export/audio-export.adapter";
import { MidiExportOptions } from "../../../domain/export-options/midi-export-options";
import { AudioExportOptions } from "../../../domain/export-options/audio-export-options";
import { SequencerService } from "./sequencer.service";

describe('SequencerComponent', () => {
  let fixture: ComponentFixture<SequencerComponent>;
  let component: SequencerComponent;
  let beatsMock: IManageBeats;
  let service: SequencerService;

  beforeEach(async () => {
    beatsMock = {
      getAllBeats: () => Promise.resolve([
        {
          label: "Techno1",
          genre: "Techno",
          bpm: BPM(128),
          tracks: [
            {
              name: "Snare",
              fileName: "metal/snare.mp3",
              steps: new Steps([false, false, false, false]),
              numberOfSteps: NumberOfSteps.sixteen,
              midiNote: Option.some(MidiDrumType.ACOUSTIC_SNARE)
            }
          ]
        },
        {
          label: "Techno2",
          genre: "Techno",
          bpm: BPM(128),
          tracks: [
            {
              name: "Snare",
              fileName: "metal/snare.mp3",
              steps: new Steps([true, true, true, true]),
              numberOfSteps: NumberOfSteps.sixteen,
              midiNote: Option.some(MidiDrumType.ACOUSTIC_SNARE)
            }
          ]
        }
      ])
    };

    SequencerEngine.reset();

    await TestBed.configureTestingModule({
      imports: [SequencerComponent],
      providers: [
        { provide: IManageBeatsToken, useValue: beatsMock },
        { provide: AUDIO_ENGINE, useClass: AudioEngineAdapterFake },
        { provide: AUDIO_EXPORT, useClass: AudioExportAdapter },
        { provide: IMIDI, useClass: MidiExportService },
        provideTranslateService({
          lang: 'en',
          fallbackLang: 'en'
        }),
        provideHttpClient(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SequencerComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(SequencerService);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("default genre and beat are selected", () => {
    fixture.detectChanges();
    expect(component.sequencerService.vm$.getValue().genre).toBe("Techno");
    expect(component.sequencerService.vm$.getValue().beat).toBe("Techno1");
  });

  it("should change the selected beat when a new beat is chosen via the app-select-input dropdown", async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.beat.label).toBe("Techno1");

    const beatSelect = fixture.debugElement.queryAll(By.css("app-select-input select"))[1];
    beatSelect.nativeElement.value = "Techno2";
    beatSelect.nativeElement.dispatchEvent(new Event("change"));
    fixture.detectChanges();

    expect(component.beat.label).toBe("Techno2");
  });

  it("should toggle a step when clicked", () => {
    fixture.detectChanges();

    const stepButtons = fixture.debugElement.queryAll(By.css('button.step'));
    const firstStepButton = stepButtons[0];

    expect(firstStepButton.nativeElement.classList.contains('active')).toBeFalse();

    firstStepButton.nativeElement.click();
    fixture.detectChanges();

    expect(firstStepButton.nativeElement.classList.contains('active')).toBeTrue();
  });

  it("step change should not be kept in memory after selected beat change", async () => {
    fixture.detectChanges();

    const stepButtons = fixture.debugElement.queryAll(By.css('button.step'));
    stepButtons[0].nativeElement.click();
    stepButtons[1].nativeElement.click();
    stepButtons[2].nativeElement.click();
    stepButtons[3].nativeElement.click();

    fixture.detectChanges();

    const modifiedActiveCount = stepButtons.filter(btn =>
      btn.nativeElement.classList.contains('active')
    ).length;

    fixture.componentInstance.beatChange("Techno2");

    fixture.detectChanges();

    fixture.componentInstance.beatChange("Techno1");

    fixture.detectChanges();

    const stepButtons2 = fixture.debugElement.queryAll(By.css('button.step'));
    const resetActiveCount = stepButtons2.filter(btn =>
      btn.nativeElement.classList.contains('active')
    ).length;

    expect(resetActiveCount).not.toEqual(modifiedActiveCount);
  });

  it("Should call export midi service on modal validation", async () => {
    spyOn(URL, 'createObjectURL').and.returnValue('blob:test');
    spyOn(URL, 'revokeObjectURL');
    const spy = spyOn(fixture.componentInstance.midiExportService, "exportBeat");

    await fixture.componentInstance.onMidiExport({} as MidiExportOptions)

    expect(spy).toHaveBeenCalled();
  });


  it("Should call export audio adapter on modal validation", async () => {
    spyOn(URL, 'createObjectURL').and.returnValue('blob:test');
    spyOn(URL, 'revokeObjectURL');
    const spy = spyOn(fixture.componentInstance.audioExportAdapter, "exportBeat");

    await fixture.componentInstance.onAudioExport({} as AudioExportOptions)

    expect(spy).toHaveBeenCalled();
  });

  it("Should disable the undo button when there is no command history", () => {
    fixture.detectChanges();

    const undoButton = fixture.debugElement.query(By.css("button.undo"));

    expect(undoButton).toBeTruthy();
    expect(undoButton.nativeElement.disabled).toBeTrue();
  });

  it("Should enable the undo button when past commands have been done", () => {
    fixture.componentInstance.sequencerService.dispatch({
      type: "SELECT_BEAT",
      payload: { genre: "Techno", beat: "Techno", tempo: 128 },
    });
    fixture.detectChanges();

    const undoButton = fixture.debugElement.query(By.css("button.undo"));

    expect(undoButton).toBeTruthy();
    expect(undoButton.nativeElement.disabled).toBeFalse();
  });

  it("Should disable the redo button when there are no future commands to apply", () => {
    fixture.detectChanges();

    const redoButton = fixture.debugElement.query(By.css("button.redo"));

    expect(redoButton).toBeTruthy();
    expect(redoButton.nativeElement.disabled).toBeTrue();
  });

  it("Should enable the redo button when there are future commands to apply", () => {
    fixture.componentInstance.sequencerService.dispatch({
      type: "SELECT_BEAT",
      payload: { genre: "Techno", beat: "Techno", tempo: 128 },
    });
    fixture.componentInstance.sequencerService.dispatch({ type: "UNDO" });
    fixture.detectChanges();

    const redoButton = fixture.debugElement.query(By.css("button.redo"));

    expect(redoButton).toBeTruthy();
    expect(redoButton.nativeElement.disabled).toBeFalse();
  });
})
