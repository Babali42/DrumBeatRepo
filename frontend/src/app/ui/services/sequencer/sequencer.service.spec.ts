/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { Option } from 'effect';
import { BPM } from '../../../domain/bpm';
import { Track } from '../../../domain/track';
import { BeatMetadata, SequencerState } from 'src/types/engine';
import { SequencerService } from './sequencer.service';

declare let SequencerEngine: any;
declare let BeatLibrary: any;

describe('SequencerService', () => {
  let service: SequencerService;

  const technoBeat: BeatMetadata = {
    label: 'Techno',
    genre: 'Electronic',
    filename: 'techno.wav'
  };
  const secondTechnoBeat: BeatMetadata = {
    label: 'Off beat',
    genre: 'Electronic',
    filename: 'off-beat.wav'
  };
  const houseBeat: BeatMetadata = {
    label: 'House',
    genre: 'Dance',
    filename: 'house.wav'
  };
  const state: SequencerState = {
    beat: technoBeat.label,
    genre: technoBeat.genre,
    tracks: [{
      name: 'kick',
      filename: 'kick.wav',
      steps: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
      midiNote: 36,
      isMuted: false,
      isSolo: true
    }],
    tempo: 128,
    beatsPerBar: 4,
    subdivisionsPerBeat: 4,
    numberOfBar: 2,
    historyLength: 3,
    futureLength: 1
  };

  beforeEach(() => {
    spyOn(BeatLibrary, 'loadBeatsManifest').and.returnValue(
      Promise.resolve([technoBeat, secondTechnoBeat, houseBeat])
    );
    SequencerEngine.reset();
    service = TestBed.inject(SequencerService);
  });

  it('loads beats and groups them by genre', async () => {
    await service.initialize();

    expect(service.genresLabel).toEqual(['Electronic', 'Dance']);
    expect(service.genres.get('Electronic')).toEqual([technoBeat, secondTechnoBeat]);
    expect(service.genres.get('Dance')).toEqual([houseBeat]);
  });

  it('clears previously loaded beats when reinitialized', async () => {
    await service.initialize();
    BeatLibrary.loadBeatsManifest.and.returnValue(
      Promise.resolve([houseBeat])
    );

    await service.initialize();

    expect(service.genresLabel).toEqual(['Dance']);
    expect([...service.genres.keys()]).toEqual(['Dance']);
  });

  it('logs and rethrows manifest loading failures', async () => {
    const error = new Error('Manifest unavailable');
    BeatLibrary.loadBeatsManifest.and.returnValue(Promise.reject(error));
    const consoleError = spyOn(console, 'error');

    await expectAsync(service.initialize()).toBeRejectedWith(error);

    expect(consoleError).toHaveBeenCalledWith('Failed to load beat manifest : ', error);
  });

  it('maps sequencer state into the view model', async () => {
    await service.initialize();
    service.state$.next(state);

    const vm = service.vm$.getValue();

    expect(vm.genre).toBe(state.genre);
    expect(vm.beats).toEqual([technoBeat.label, secondTechnoBeat.label]);
    expect(vm.beat).toBe(state.beat);
    expect(vm.tempo).toBe(BPM(state.tempo));
    expect(vm.beatsPerBar).toBe(state.beatsPerBar);
    expect(vm.subdivisionsPerBeat).toBe(state.subdivisionsPerBeat);
    expect(vm.numberOfBar).toBe(state.numberOfBar);
    expect(vm.historyLength).toBe(state.historyLength);
    expect(vm.futureLength).toBe(state.futureLength);
    expect(vm.tracks).toHaveSize(1);
    expect(vm.tracks[0]).toEqual(jasmine.any(Track));
    expect(vm.tracks[0].steps.steps).toEqual(state.tracks[0].steps);
    expect(vm.tracks[0].isMuted).toBe(state.tracks[0].isMuted);
    expect(vm.tracks[0].isSolo).toBe(state.tracks[0].isSolo);
    expect(Option.isSome(vm.tracks[0].midiNote)).toBeTrue();
  });

  it('keeps the previous view model when the state is cleared', () => {
    service.state$.next(state);
    const vm = service.vm$.getValue();

    service.state$.next(null);

    expect(service.vm$.getValue()).toBe(vm);
  });

  it('dispatches commands and publishes the resulting engine state', async () => {
    const command = { type: 'SET_TEMPO', payload: { tempo: 129 } };
    const dispatch = spyOn(SequencerEngine, 'dispatch').and.returnValue(Promise.resolve());
    spyOn(SequencerEngine, 'getState').and.returnValue(state);

    await service.dispatch(command);

    expect(dispatch).toHaveBeenCalledWith(command);
    expect(service.state$.getValue()).toBe(state);
    expect(service.vm$.getValue().tempo).toBe(BPM(state.tempo));
  });
});
