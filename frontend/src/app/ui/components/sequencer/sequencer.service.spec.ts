import { TestBed } from '@angular/core/testing';
import { SequencerService } from './sequencer.service';
import { BPM } from '../../../domain/bpm';
import { IManageBeatsToken } from '../../../infrastructure/injection-tokens/i-manage-beat.token';
import { Steps } from '../../../domain/steps';
import { NumberOfSteps } from '../../../domain/number-of-steps';
import { MidiDrumType } from '../../../domain/midi-drum-type';
import { Option } from "effect";

describe('SequencerService undo', () => {
  let service: SequencerService;

  beforeEach(async () => {
    SequencerEngine.reset();

    const beatsMock = {
      getAllBeats: () => Promise.resolve([
        {
          label: "Techno1",
          genre: "Techno",
          bpm: BPM(128),
          tracks: [
            {
              name: "Snare",
              fileName: "metal/snare.mp3",
              steps: new Steps([false, false, false, false]),
              numberOfSteps: NumberOfSteps.sixteen,
              midiNote: Option.some(MidiDrumType.ACOUSTIC_SNARE)
            }
          ]
        },
        {
          label: "Techno2",
          genre: "Techno",
          bpm: BPM(128),
          tracks: [
            {
              name: "Snare",
              fileName: "metal/snare.mp3",
              steps: new Steps([true, true, true, true]),
              numberOfSteps: NumberOfSteps.sixteen,
              midiNote: Option.some(MidiDrumType.ACOUSTIC_SNARE)
            }
          ]
        }
      ])
    };

    await TestBed.configureTestingModule({
      providers: [
        { provide: IManageBeatsToken, useValue: beatsMock },
      ]
    }).compileComponents();

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
