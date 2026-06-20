import { TestBed } from '@angular/core/testing';
import { SequencerService } from './sequencer.service';

describe('SequencerService undo', () => {
  let service: SequencerService;

  beforeEach(() => {
    SequencerEngine.reset();
    TestBed.configureTestingModule({ providers: [SequencerService] });
    service = TestBed.inject(SequencerService);
  });

  function currentState() {
    return service.state$.getValue()!;
  }

  it('undoes a SELECT_BEAT', () => {
    service.dispatch({ type: 'SELECT_BEAT', payload: { beat: 'Techno' } });
    expect(currentState().beat).toBe('Techno');

    service.dispatch({ type: 'UNDO' });
    expect(currentState().beat).toBe('Tresillo');
    expect(currentState().futureLength).toBe(1);
  });

  it('reapplies SELECT_BEAT after undo then redo', () => {
    service.dispatch({ type: 'SELECT_BEAT', payload: { beat: '4 on the floor' } });
    service.dispatch({ type: 'UNDO' });
    expect(currentState().beat).toBe('Tresillo');

    service.dispatch({ type: 'REDO' });
    expect(currentState().beat).toBe('4 on the floor');
  });

  it('undoes a SELECT_GENRE', () => {
    service.dispatch({ type: 'SELECT_GENRE', payload: { genre: 'Techno' } });
    expect(currentState().genre).toBe('Techno');

    service.dispatch({ type: 'UNDO' });
    expect(currentState().genre).toBe('Hypnotic Techno');
    expect(currentState().futureLength).toBe(1);
  });
});
