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
    return service.state$.getValue();
  }

  it('undoes a single toggle', () => {
    service.dispatch({ type: 'CHANGE_BEAT', payload: { selectedBeat: "Techo" } });
    expect(currentState().steps[0].active).toBeTrue();

    service.dispatch({ type: 'UNDO' });
    expect(currentState().steps[0].active).toBeFalse();
  });

  it('reapplies step after undo then redo', () => {
    service.dispatch({ type: 'TOGGLE_STEP', payload: { index: 0 } });
    service.dispatch({ type: 'UNDO' });
    expect(currentState().steps[0].active).toBeFalse();

    service.dispatch({ type: 'REDO' });
    expect(currentState().steps[0].active).toBeTrue();
  });

  it('does nothing when undoing with an empty history', () => {
    SequencerEngine.reset();
    service.state$.next(SequencerEngine.getState());

    const state = currentState();
    service.dispatch({ type: 'UNDO' });
    expect(currentState()).toEqual(state);
  });

  it('does nothing when redoing with an empty future', () => {
    service.dispatch({ type: 'TOGGLE_STEP', payload: { index: 0 } });
    const state = currentState();
    service.dispatch({ type: 'REDO' });
    expect(currentState()).toEqual(state);
  });
});
