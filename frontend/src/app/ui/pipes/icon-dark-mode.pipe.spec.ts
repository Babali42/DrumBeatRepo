import { IconDarkModePipe } from './icon-dark-mode.pipe';
import {of} from "rxjs";
import {Mode} from "../services/light-dark-mode/mode-toggle.model";
import {ModeToggleService} from "../services/light-dark-mode/mode-toggle.service";

describe('IconDarkModePipe', () => {
  it('should transform snare drum to snare image with dark theme', () => {
    const darkModeToggleService = {
      modeChanged$: of(Mode.DARK)
    } as Partial<ModeToggleService> as ModeToggleService;
    const pipe = new IconDarkModePipe(darkModeToggleService);
    expect(pipe.transform("assets/images/drums/snare.svg"))
      .toEqual("assets/images/drums/snare-dark.svg");
  });

  it('should transform snare drum to snare image with light theme', () => {
    const darkModeToggleService = {
      modeChanged$: of(Mode.LIGHT)
    } as Partial<ModeToggleService> as ModeToggleService;
    const pipe = new IconDarkModePipe(darkModeToggleService);
    expect(pipe.transform("assets/images/drums/snare.svg"))
      .toEqual("assets/images/drums/snare-light.svg");
  });
});
