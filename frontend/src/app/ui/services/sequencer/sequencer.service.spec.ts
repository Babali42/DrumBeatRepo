/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { SequencerService } from './sequencer.service';
import { BPM } from '../../../domain/bpm';

declare let SequencerEngine: any;
declare let BeatLibrary: any;

describe('SequencerService', () => {
  let service: SequencerService;

  const beatFromManifest = { label: "techno", genre: "techno", filename: "techno" }

  beforeEach(async () => {
    spyOn(BeatLibrary, 'loadBeatsManifest').and.returnValue(
      Promise.resolve([
        beatFromManifest
      ])
    );

    SequencerEngine.reset();
    service = TestBed.inject(SequencerService);
  });

  function currentState() {
    return service.state$.getValue()!;
  }

  it('loads beat data from repository when selecting a beat', async () => {
    await service.initialize();
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
    expect(currentState().tracks[0].name).toBe('kick');
    expect(currentState().tracks[0].steps).toEqual([
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      true,
      false,
      false,
      false
    ]);

    expect(currentState().tempo).toBe(128);
  });

  it('updates view model after select beat', async () => {
    await service.initialize();
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
