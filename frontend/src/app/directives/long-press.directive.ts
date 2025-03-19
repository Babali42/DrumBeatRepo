import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
} from '@angular/core';
import { fromEvent, merge, of, Subscription, timer } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

@Directive({
  selector: '[longPress]',
  standalone: true
})
export class LongPressDirective implements OnDestroy {
  private eventSubscribe: Subscription;
  threshold = 500;

  @Output()
  mouseLongPress = new EventEmitter();

  constructor(private elementRef: ElementRef) {
    const mousedown = fromEvent<MouseEvent>(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      elementRef.nativeElement,
      'mousedown'
    ).pipe(
      filter((event) => event.button == 0), // Only allow left button (Primary button)
      map((event) => true) // turn on threshold counter
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const touchstart = fromEvent(elementRef.nativeElement, 'touchstart').pipe(
      map(() => true)
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const touchEnd = fromEvent(elementRef.nativeElement, 'touchend').pipe(
      map(() => false)
    );
    const mouseup = fromEvent<MouseEvent>(window, 'mouseup').pipe(
      filter((event) => event.button == 0), // Only allow left button (Primary button)
      map(() => false) // reset threshold counter
    );

    this.eventSubscribe = merge(mousedown, mouseup, touchstart, touchEnd)
      .pipe(
        switchMap((state) => (state ? timer(this.threshold, 10) : of(null))),
        // @ts-expect-error: Filter expects a non-null value, but we are handling null values
        filter(value => value)
      )
      .subscribe(() => this.mouseLongPress.emit());
  }

  ngOnDestroy(): void {
    if (this.eventSubscribe) {
      this.eventSubscribe.unsubscribe();
    }
  }
}
