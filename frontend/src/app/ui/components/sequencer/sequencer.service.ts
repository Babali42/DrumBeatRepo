import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SequencerState } from '../../../../types/engine';
import { SequencerViewModel } from './sequencer.viewmodel';
import { BPM } from 'src/app/domain/bpm';

export interface Command {
  readonly type: string;
  readonly payload?: unknown;
}

@Injectable({ providedIn: 'root' })
export class SequencerService {

  state$ = new BehaviorSubject<SequencerState | null>(null);
  vm$ = new BehaviorSubject<SequencerViewModel>({} as SequencerViewModel);

  constructor() {
    this.state$.subscribe(x => {
      if (x) {
        this.vm$.next({
          genre: x.genre,
          beat: x.beat,
          tempo: BPM(x.tempo),
          historyLength: x.historyLength,
          futureLength: x.futureLength,
        });
      }
    });
  }

  dispatch(cmd: Command) {
    SequencerEngine.dispatch(cmd);
    this.state$.next(SequencerEngine.getState());
  }
}
