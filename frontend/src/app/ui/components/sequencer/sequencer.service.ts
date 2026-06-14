import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Command {
  type: string;
  payload?: any;
}

@Injectable({providedIn : 'root'})
export class SequencerService {

  state$ = new BehaviorSubject<any>(null);

  dispatch(cmd: Command) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    SequencerEngine.dispatch(cmd);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    this.state$.next(SequencerEngine.getState());
  }
}
