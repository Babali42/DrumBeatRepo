/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { SequencerService } from './sequencer.service';
import { BPM } from '../../../domain/bpm';
import { IManageBeatsToken } from '../../../infrastructure/injection-tokens/i-manage-beat.token';
import { Effect, Option } from 'effect';
import { Steps } from '../../../domain/steps';
import { MidiDrumType } from '../../../domain/midi-drum-type';
import { Beat } from '../../../domain/beat';
import { BEATS_MANIFEST } from '../../../../assets/beats/beats-manifest';

declare let SequencerEngine: any;

describe('SequencerService', () => {
  let service: SequencerService;

  const beatFromManifest = BEATS_MANIFEST[0];

  beforeEach(async () => {
    SequencerEngine.reset();

    const beatsMock = {
      getBeatByFileName: jasmine.createSpy('getBeatByFileName').and.returnValue(
        Effect.succeed({
          label: beatFromManifest.label,
          genre: beatFromManifest.genre,
          bpm: BPM(128),
          beatsPerBar: 4,
          subdivisionsPerBeat: 4,
          numberOfBar: 1,
          tracks: [
            {
              name: 'Snare',
              filename: 'metal/snare.mp3',
              steps: new Steps([true, true, true, true]),
              isMuted: false,
              midiNote: Option.some(MidiDrumType.ACOUSTIC_SNARE)
            }
          ]
        } as Beat)
      )
    };

    await TestBed.configureTestingModule({
      providers: [
        {
          provide: IManageBeatsToken,
          useValue: beatsMock
        }
      ]
    }).compileComponents();

    service = TestBed.inject(SequencerService);
  });

  function currentState() {
    return service.state$.getValue()!;
  }

  it('loads beat data from repository when selecting a beat', async () => {
    service.initialize();
    await service.dispatch({
      type: 'SELECT_BEAT',
      payload: {
        genre: beatFromManifest.genre,
        beat: beatFromManifest.label
      }
    });

    expect(currentState().genre).toBe(beatFromManifest.genre);
    expect(currentState().beat).toBe(beatFromManifest.label);

    expect(currentState().tracks.length).toBe(1);
    expect(currentState().tracks[0].name).toBe('Snare');
    expect(currentState().tracks[0].steps).toEqual([
      true,
      true,
      true,
      true
    ]);

    expect(currentState().tempo).toBe(128);
  });

  it('updates view model after select beat', async () => {
    service.initialize();
    await service.dispatch({
      type: 'SELECT_BEAT',
      payload: {
        genre: beatFromManifest.genre,
        beat: beatFromManifest.label
      }
    });

    const vm = service.vm$.getValue();

    expect(vm.genre).toBe(beatFromManifest.genre);
    expect(vm.beat).toBe(beatFromManifest.label);
    expect(vm.tempo).toBe(BPM(128));
  });

  it('applies a tempo command', async () => {
    await service.dispatch({
      type: 'SET_TEMPO',
      payload: { tempo: 129 }
    });

    expect(currentState().tempo).toBe(129);
  });
});