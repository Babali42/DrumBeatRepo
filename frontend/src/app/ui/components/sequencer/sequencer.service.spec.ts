import { TestBed } from '@angular/core/testing';
import { SequencerService } from './sequencer.service';

describe('SequencerService undo', () => {
  let service: SequencerService;

  beforeEach(() => {
    SequencerEngine.reset();
    TestBed.configureTestingModule({ providers: [SequencerService] });
    service = TestBed.inject(SequencerService);
    service.dispatch({ type: 'CLEAR_ALL' });
  });

  function currentState() {
    return service.state$.getValue()!;
  }

  it('undoes a SELECT_BEAT', () => {
    service.dispatch({ type: 'SELECT_BEAT', payload: { beat: 'Techno' } });
    expect(currentState().beat).toBe('Techno');

    service.dispatch({ type: 'UNDO' });
    expect(currentState().beat).toBe('');
    expect(currentState().futureLength).toBe(1);
  });

  it('reapplies SELECT_BEAT after undo then redo', () => {
    service.dispatch({ type: 'SELECT_BEAT', payload: { beat: '4 on the floor' } });
    service.dispatch({ type: 'UNDO' });
    expect(currentState().beat).toBe('');

    service.dispatch({ type: 'REDO' });
    expect(currentState().beat).toBe('4 on the floor');
  });

  it('undoes a SELECT_GENRE', () => {
    service.dispatch({ type: 'SELECT_GENRE', payload: { genre: 'Techno' } });
    expect(currentState().genre).toBe('Techno');

    service.dispatch({ type: 'UNDO' });
    expect(currentState().genre).toBe('');
    expect(currentState().futureLength).toBe(1);
  });

  it('does nothing when undoing with an empty history', () => {
    SequencerEngine.reset();
    service.state$.next(SequencerEngine.getState());

    const state = currentState();
    service.dispatch({ type: 'UNDO' });
    expect(currentState()).toEqual(state);
  });

  it('does nothing when redoing with an empty future', () => {
    const state = currentState();
    service.dispatch({ type: 'REDO' });
    expect(currentState()).toEqual(state);
  });
});
