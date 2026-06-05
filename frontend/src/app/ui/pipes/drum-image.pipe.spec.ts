import { DrumImagePipe } from './drum-image.pipe';
import {MidiDrumType} from "../../domain/midi-drum-type";
import {Option} from "effect";
import {ModeToggleService} from "../services/light-dark-mode/mode-toggle.service";
import {Mode} from "../services/light-dark-mode/mode-toggle.model";
import {of} from "rxjs";

describe('DrumImagePipe', () => {
  const mockModeToggleService = {
    modeChanged$: of(Mode.LIGHT)
  } as Partial<ModeToggleService> as ModeToggleService;

  it('create an instance', () => {
    const pipe = new DrumImagePipe(mockModeToggleService);
    expect(pipe).toBeTruthy();
  });

  it('should transform none to default image', () => {
    const pipe = new DrumImagePipe(mockModeToggleService);
    expect(pipe.transform(Option.none<MidiDrumType>()))
      .toEqual("assets/images/drums/light/default.svg");
  });

  it('should transform none to default image when dark mode is on', () => {
    const darkModeToggleService = {
      modeChanged$: of(Mode.DARK)
    } as Partial<ModeToggleService> as ModeToggleService;
    const pipe = new DrumImagePipe(darkModeToggleService);
    expect(pipe.transform(Option.none<MidiDrumType>()))
      .toEqual("assets/images/drums/dark/default.svg");
  });

  it('should transform bass drum to kick image', () => {
    const pipe = new DrumImagePipe(mockModeToggleService);
    expect(pipe.transform(Option.some<MidiDrumType>(MidiDrumType.BASS_DRUM_1)))
      .toEqual("assets/images/drums/light/kick.svg");
  });

  it('should transform snare drum to snare image', () => {
    const pipe = new DrumImagePipe(mockModeToggleService);
    expect(pipe.transform(Option.some<MidiDrumType>(MidiDrumType.ACOUSTIC_SNARE)))
      .toEqual("assets/images/drums/light/snare.svg");
  });

  it('should transform snare drum to snare image when dark theme is on', () => {
    const darkModeToggleService = {
      modeChanged$: of(Mode.DARK)
    } as Partial<ModeToggleService> as ModeToggleService;
    const pipe = new DrumImagePipe(darkModeToggleService);
    expect(pipe.transform(Option.some<MidiDrumType>(MidiDrumType.ACOUSTIC_SNARE)))
      .toEqual("assets/images/drums/dark/snare.svg");
  });

  it('should transform closed hat drum to hat image', () => {
    const pipe = new DrumImagePipe(mockModeToggleService);
    expect(pipe.transform(Option.some<MidiDrumType>(MidiDrumType.CLOSED_HI_HAT)))
      .toEqual("assets/images/drums/light/hihats.svg");
  });

  it('should transform open hat drum to hat image', () => {
    const pipe = new DrumImagePipe(mockModeToggleService);
    expect(pipe.transform(Option.some<MidiDrumType>(MidiDrumType.OPEN_HI_HAT)))
      .toEqual("assets/images/drums/light/hihats.svg");
  });

  it('should transform crash drum to default image', () => {
    const pipe = new DrumImagePipe(mockModeToggleService);
    expect(pipe.transform(Option.some<MidiDrumType>(MidiDrumType.CRASH_CYMBAL_1)))
      .toEqual("assets/images/drums/light/default.svg");
  });
});
