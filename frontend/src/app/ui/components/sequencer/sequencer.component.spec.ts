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
import {Track} from "../../../domain/track";
import {Steps} from "../../../domain/steps";
import {NumberOfSteps} from "../../../domain/number-of-steps";
import {StepIndex} from "../../../domain/step-index";
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
            ] as ReadonlyArray<Track>
          } as Beat,
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
    expect(component).toBeDefined();
  });

  it("default genre and beat are selected", () => {
    fixture.detectChanges();
    expect(component.selectedGenreLabel).toBe("Techno");
    expect(component.beat.label).toBe("Techno1");
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

  it("step change should not be kept in memory after selected beat change", async () => {
    fixture.detectChanges();

    const stepButtons = fixture.debugElement.queryAll(By.css('button.step'));
    stepButtons[0].nativeElement.click();
    stepButtons[1].nativeElement.click();
    stepButtons[2].nativeElement.click();
    stepButtons[3].nativeElement.click();

    fixture.detectChanges();

    const modifiedPatternNumberOfClicks = stepButtons.filter(btn =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
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
    const numberOfStepsAfterBeatChangeAndReset = stepButtons2.filter(btn =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      btn.nativeElement.classList.contains('active')
    ).length;

    console.error(`${modifiedPatternNumberOfClicks} and ${numberOfStepsAfterBeatChangeAndReset}`)
    expect(modifiedPatternNumberOfClicks).not.toEqual(numberOfStepsAfterBeatChangeAndReset);
  });

  it("Should call export midi service on modal validation", async () => {
    //Arrange
    spyOn(URL, 'createObjectURL').and.returnValue('blob:test');
    spyOn(URL, 'revokeObjectURL');
    const spy = spyOn(fixture.componentInstance.midiExportService, "exportBeat");
    await fixture.componentInstance.onMidiExport({} as MidiExportOptions)

    //Assert
    expect(spy).toHaveBeenCalled();
  });


  it("when loading the page then clicking play the current index should be updated", () => {
    fixture.detectChanges();

    const playButton = fixture.debugElement.query(By.css('.play-pause-button'));
    playButton.nativeElement.click();
    fixture.detectChanges();

    expect(component.soundService.isPlaying).toBeTrue();

    const stepButtons = fixture.debugElement.queryAll(By.css('button.step'));
    expect(stepButtons[0].nativeElement.classList.contains('current')).toBeTrue();

    (component.soundService as AudioEngineAdapterFake).index = StepIndex(1);
    fixture.detectChanges();

    expect(stepButtons[1].nativeElement.classList.contains('current')).toBeTrue();
    expect(stepButtons[0].nativeElement.classList.contains('current')).toBeFalse();
  });

  it("Should call export audio adapter on modal validation", async () => {
    //Arrange
    spyOn(URL, 'createObjectURL').and.returnValue('blob:test');
    spyOn(URL, 'revokeObjectURL');
    const spy = spyOn(fixture.componentInstance.audioExportAdapter, "exportBeat");

    //Act
    await fixture.componentInstance.onAudioExport({} as AudioExportOptions)

    //Assert
    expect(spy).toHaveBeenCalled();
  });
})
