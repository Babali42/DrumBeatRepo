import { Injectable } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PlayerEventsService {
  readonly playPause$ = new Subject<string>();

  constructor() {
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(filter(e => e.code === 'Space'), map(() => 'toggle'))
      .subscribe(value => this.playPause$.next(value));
  }
}
