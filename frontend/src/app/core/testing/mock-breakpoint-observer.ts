import {BehaviorSubject, Observable} from "rxjs";
import {BreakpointState} from "@angular/cdk/layout";

export class MockBreakpointObserver {
  private subject = new BehaviorSubject<BreakpointState>({matches: true, breakpoints: {}});

  observe(): Observable<BreakpointState> {
    return this.subject.asObservable();
  }

  // helper for tests
  setMatches(matches: boolean) {
    this.subject.next({matches, breakpoints: {}});
  }
}
