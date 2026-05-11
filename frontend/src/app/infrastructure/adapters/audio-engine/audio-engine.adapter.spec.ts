import {AudioEngineAdapter} from "./audio-engine.adapter";
import {Track} from "../../../domain/track";
import {Steps} from "../../../domain/steps";
import {NumberOfSteps} from "../../../domain/number-of-steps";
import {BPM} from "../../../domain/bpm";
import {MidiDrumType} from "../../../domain/midi-drum-type";
import {Option} from "effect";

describe('AudioEngineAdapter', () => {
  let mockContext: jasmine.SpyObj<AudioContext>;
  let mockBufferSourceNode: jasmine.SpyObj<AudioBufferSourceNode>;
  let adapter: AudioEngineAdapter;
  let mockNgZone: any;
  let mockTempoService: any;

  beforeEach(() => {
    mockBufferSourceNode = jasmine.createSpyObj('AudioBufferSourceNode', [
      'connect', 'start', 'stop'
    ]);

    mockContext = jasmine.createSpyObj('AudioContext', [
      'createBufferSource', 'decodeAudioData', 'resume'
    ]);
    mockContext.createBufferSource.and.returnValue(mockBufferSourceNode);
    Object.defineProperty(mockContext, 'destination', {
      value: {} as AudioDestinationNode,
      writable: false
    });
    mockContext.decodeAudioData.and.resolveTo({} as AudioBuffer);

    spyOn(window, 'AudioContext').and.returnValue(mockContext);

    mockNgZone = { run: (fn: Function) => fn() };
    mockTempoService = {
      bpm: BPM(128),
      stepDuration: 0.125,
      barDuration: 0.5,
      numberOfSteps: 16,
      getNextStepTime: () => 0
    };

    adapter = new AudioEngineAdapter(mockNgZone, mockTempoService);

    const track: Track = {
      name: 'Kick',
      fileName: 'techno/kick.wav',
      steps: new Steps([true]),
      numberOfSteps: NumberOfSteps.sixteen,
      midiNote: Option.some(MidiDrumType.ACOUSTIC_BASS_DRUM)
    };

    spyOn<any>(adapter['audioFilesService'], 'getAudioBuffer').and.resolveTo(
      Option.some({ duration: 1, length: 44100, sampleRate: 44100, numberOfChannels: 1 } as AudioBuffer)
    );

    adapter.setTracks([track]);
  });

  it('should play a sound when playTrack is called', async () => {
    await new Promise(resolve => setTimeout(resolve));
    adapter.playTrack('Kick');

    expect(mockBufferSourceNode.connect).toHaveBeenCalled();
    expect(mockBufferSourceNode.start).toHaveBeenCalled();
  });

  it('should not play when track name is unknown', () => {
    adapter.playTrack('Unknown Track');

    expect(mockBufferSourceNode.start).not.toHaveBeenCalled();
  });
});
