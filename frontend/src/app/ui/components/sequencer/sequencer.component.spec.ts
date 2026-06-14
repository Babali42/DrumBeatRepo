import {SequencerComponent} from "./sequencer.component";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {provideRouter} from "@angular/router";
import {provideHttpClient} from "@angular/common/http";
import {By} from "@angular/platform-browser";
import {IManageBeatsToken} from "../../../infrastructure/injection-tokens/i-manage-beat.token";
import {AUDIO_ENGINE} from "../../../infrastructure/injection-tokens/audio-engine.token";
import {
  AudioEngineAdapterFake
} from "../../../infrastructure/adapters/audio-engine/audio-engine.adapter.fake";
import IManageBeats from "../../../domain/ports/i-manage-beats";
import {Beat} from "../../../domain/beat";
import {Steps} from "../../../domain/steps";
import {NumberOfSteps} from "../../../domain/number-of-steps";
import {BPM} from "../../../domain/bpm";
import {MidiDrumType} from "../../../domain/midi-drum-type";
import {provideTranslateService} from "@ngx-translate/core";
import {Option} from "effect";
import {IMIDI} from "../../../infrastructure/injection-tokens/i-midi.token";
import {MidiExportService} from "../../../infrastructure/adapters/midi-export/midi-exporter.service";
import {AUDIO_EXPORT} from "../../../infrastructure/injection-tokens/audio-export.token";
import {AudioExportAdapter} from "../../../infrastructure/adapters/audio-export/audio-export.adapter";
import {MidiExportOptions} from "../../../domain/export-options/midi-export-options";
import {AudioExportOptions} from "../../../domain/export-options/audio-export-options";

describe('SequencerComponent', () => {
  let fixture: ComponentFixture<SequencerComponent>;
  let component: SequencerComponent;
  let beatsMock: IManageBeats;

  beforeEach(async () => {
    beatsMock = {
      getAllBeats(): Promise<readonly Beat[]> {
        return Promise.resolve([
          {
            "label": "Techno1",
            "genre": "Techno",
            "bpm": BPM(128),
            "tracks": [
              {
                "name": "Snare",
                "fileName": "metal/snare.mp3",
                "steps": new Steps([false, false, false, false]),
                "numberOfSteps": NumberOfSteps.sixteen,
                "midiNote": Option.some(MidiDrumType.ACOUSTIC_SNARE)
              }
            ]
          },
          {
            "label": "Techno2",
            "genre": "Techno",
            "bpm": BPM(128),
            "tracks": [
              {
                "name": "Snare",
                "fileName": "metal/snare.mp3",
                "steps": new Steps([true, true, true, true]),
                "numberOfSteps": NumberOfSteps.sixteen,
                "midiNote": Option.some(MidiDrumType.ACOUSTIC_SNARE)
              }
            ]
          }
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
        { provide: AUDIO_EXPORT, useClass: AudioExportAdapter },
        provideTranslateService({
          lang: 'en',
          fallbackLang: 'en'
        }),
        provideHttpClient(),
        provideRouter([]),
        { provide: IMIDI, useClass: MidiExportService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SequencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("default genre and beat are selected", () => {
    fixture.detectChanges();
    expect(component.selectedGenreLabel).toBe("Techno");
    expect(component.beat.label).toBe("Techno1");
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

    const genres = new Map<string, Beat[]>();
    await beatsMock.getAllBeats().then(x => genres.set("Techno", [...x]));

    fixture.componentInstance.genres = genres;
    fixture.componentInstance.selectedGenreLabel = "Techno";

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

  it("Should not contain an undo button when there is no command history", () => {
    fixture.componentInstance.historyLength = 0;
    fixture.detectChanges();

    const undoButton = fixture.debugElement.queryAll(By.css("button.undo"));

    expect(undoButton.length).toBe(0);
  });

  it("Should contain an undo button when past command have been done", () => {
    fixture.componentInstance.historyLength = 234;
    fixture.detectChanges();

    const undoButton = fixture.debugElement.queryAll(By.css("button.undo"));

    expect(undoButton.length).not.toBe(0);
  });

  it("Should not contain a redo button when there is not future command to apply", () => {
    fixture.componentInstance.futureLength = 0;
    fixture.detectChanges();

    const redoButton = fixture.debugElement.queryAll(By.css("button.redo"));

    expect(redoButton.length).toBe(0);
  });

  it("Should contain a redo button when there is none future commands", () => {
    fixture.componentInstance.futureLength = 23;
    fixture.detectChanges();

    const redoButton = fixture.debugElement.queryAll(By.css("button.redo"));

    expect(redoButton.length).not.toBe(0);
  });
})
