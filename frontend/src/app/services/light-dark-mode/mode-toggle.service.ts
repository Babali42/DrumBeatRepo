import {DOCUMENT} from "@angular/common";
import {Inject, Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {Mode} from "./mode-toggle.model";

/**
 * Angular service that provides the mode toggle feature.
 * In summary this service adds the `class='light'` to the document.body element and
 * styles change based on the class added to the document.body
 *
 * Also provides a Observable that emits the current mode every time mode changes
 */
@Injectable({providedIn: 'root'})
export class ModeToggleService {
  /**
   * contains the current active mode
   * avoid mutating it directly, instead use `updateCurrentMode`
   */
  private currentMode: Mode = Mode.LIGHT;

  /**
   * BehaviorSubject that detects the mode changes
   */
  private modeChangedSubject = new BehaviorSubject(this.currentMode);

  /**
   * Observable that emits the current mode when mode changes.
   * Exposed publicly so that other components can use this feature
   */
  modeChanged$: Observable<Mode>;

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
    this.modeChanged$ = this.modeChangedSubject.asObservable();
    this.init();
  }

  /**
   * Function to mutate the currentMode
   * @param mode Mode
   */
  private updateCurrentMode(mode: Mode) {
    this.currentMode = mode;
    this.modeChangedSubject.next(this.currentMode);
  }

  /**
   * Init function that update the application based on the initial mode value
   * Flow as below
   * 1 - If there is a saved mode in the browser - use this as the initial value
   * 2 - If there is no saved mode, Check for the preferred device theme
   * 3 - If device theme is dark, set the init value to `dark`
   * 4 - Else set the default value to `light`
   */
  private init() {
    const deviceMode = window.matchMedia("(prefers-color-scheme: dark)");
    this.updateCurrentMode(deviceMode.matches ? Mode.DARK : Mode.LIGHT)
    this.document.body.classList.add(this.currentMode)
  }
}
