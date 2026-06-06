import { DrumImagePipe } from './drum-image.pipe';
import {MidiDrumType} from "../../domain/midi-drum-type";
import {Option} from "effect";

describe('DrumImagePipe', () => {
  it('should transform none to default image', () => {
    const pipe = new DrumImagePipe();
    expect(pipe.transform(Option.none<MidiDrumType>()))
      .toEqual("assets/images/drums/default.svg");
  });

  it('should transform bass drum to kick image', () => {
    const pipe = new DrumImagePipe();
    expect(pipe.transform(Option.some<MidiDrumType>(MidiDrumType.BASS_DRUM_1)))
      .toEqual("assets/images/drums/kick.svg");
  });

  it('should transform snare drum to snare image', () => {
    const pipe = new DrumImagePipe();
    expect(pipe.transform(Option.some<MidiDrumType>(MidiDrumType.ACOUSTIC_SNARE)))
      .toEqual("assets/images/drums/snare.svg");
  });

  it('should transform closed hat drum to hat image', () => {
    const pipe = new DrumImagePipe();
    expect(pipe.transform(Option.some<MidiDrumType>(MidiDrumType.CLOSED_HI_HAT)))
      .toEqual("assets/images/drums/hihats.svg");
  });

  it('should transform open hat drum to hat image', () => {
    const pipe = new DrumImagePipe();
    expect(pipe.transform(Option.some<MidiDrumType>(MidiDrumType.OPEN_HI_HAT)))
      .toEqual("assets/images/drums/hihats.svg");
  });

  it('should transform crash drum to default image', () => {
    const pipe = new DrumImagePipe();
    expect(pipe.transform(Option.some<MidiDrumType>(MidiDrumType.CRASH_CYMBAL_1)))
      .toEqual("assets/images/drums/default.svg");
  });
});
