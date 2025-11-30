import { TestBed } from '@angular/core/testing';
import { PlayerEventsService } from './player.events.service';

describe('PlayerEventsService', () => {
  let service: PlayerEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit "toggle" when Space key is pressed', (done) => {
    service.playPause$.subscribe((value: any) => {
      expect(value).toBe('toggle');
      done();
    });

    // Dispatch a fake Space keydown event on the document
    const event = new KeyboardEvent('keydown', { code: 'Space' });
    document.dispatchEvent(event);
  });

  it('should not emit for other keys', (done) => {
    let emitted = false;

    service.playPause$.subscribe(() => {
      emitted = true;
    });

    const event = new KeyboardEvent('keydown', { code: 'KeyA' });
    document.dispatchEvent(event);

    setTimeout(() => {
      expect(emitted).toBeFalse();
      done();
    }, 10);
  });
});
