import { TestBed } from '@angular/core/testing';
import { SequencerService } from './sequencer.service';
import { BPM } from '../../../domain/bpm';

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
    service.dispatch({ type: 'SELECT_BEAT', payload: { genre: "Techno", beat: '4 on the floor', tempo: 128 } });
    expect(currentState().genre).toBe('Techno');
    expect(currentState().beat).toBe('4 on the floor');

    service.dispatch({ type: 'UNDO' });
    expect(currentState().beat).toBe('Tresillo');
    expect(currentState().futureLength).toBe(1);
  });

  it('reapplies SELECT_BEAT after undo then redo', () => {
    service.dispatch({ type: 'SELECT_BEAT', payload: { genre: "Techno", beat: '4 on the floor', tempo: 128 } });
    service.dispatch({ type: 'UNDO' });
    expect(currentState().beat).toBe('Tresillo');

    service.dispatch({ type: 'REDO' });
    expect(currentState().beat).toBe('4 on the floor');
  });

  it('should apply a setTempo command', () => {
    service.dispatch({ type: 'SET_TEMPO', payload: { tempo: 129 } });
    expect(currentState().tempo).toBe(129)
  });

  it('should update the viewmodel when state change', (done) => {
    service.dispatch({ type: 'SELECT_BEAT', payload: { genre: "Techno", beat: '4 on the floor', tempo: 128 } });
    service.vm$
      .subscribe(vm => {
        expect(vm.genre).toBe("Techno");
        expect(vm.beat).toBe("4 on the floor");
        expect(vm.tempo).toBe(BPM(128));
        done();
      });
  });
});
