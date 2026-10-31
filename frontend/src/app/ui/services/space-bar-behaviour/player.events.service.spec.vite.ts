import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
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

  it('should emit "toggle" when Space key is pressed', async () => {
    const emitted = firstValueFrom(service.playPause$);

    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));

    await expect(emitted).resolves.toBe('toggle');
  });

  it('should not emit for other keys', async () => {
    let emitted = false;
    const subscription = service.playPause$.subscribe(() => {
      emitted = true;
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA' }));
    await new Promise(resolve => setTimeout(resolve, 10));

    subscription.unsubscribe();
    expect(emitted).toBe(false);
  });
});
