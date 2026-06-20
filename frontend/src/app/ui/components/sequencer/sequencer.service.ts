import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SequencerState } from '../../../../types/engine';

export interface Command {
  readonly type: string;
  readonly payload?: unknown;
}

@Injectable({providedIn : 'root'})
export class SequencerService {

  state$ = new BehaviorSubject<SequencerState | null>(null);

  dispatch(cmd: Command) {
    SequencerEngine.dispatch(cmd);
    this.state$.next(SequencerEngine.getState());
  }
}
