import {AudioEngineAdapter} from "./audio-engine.adapter";
import {Track} from "../../../domain/track";
import {Steps} from "../../../domain/steps";
import {NumberOfSteps} from "../../../domain/number-of-steps";
import {BPM} from "../../../domain/bpm";
import {MidiDrumType} from "../../../domain/midi-drum-type";
import {StepIndex} from "../../../domain/step-index";
import {Option} from "effect";
import {Seconds} from "../../../domain/seconds";

describe('AudioEngineAdapter', () => {
  let mockContext: jasmine.SpyObj<AudioContext>;
  let mockBufferSourceNode: jasmine.SpyObj<AudioBufferSourceNode>;
  let adapter: AudioEngineAdapter;
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

    mockTempoService = {
      bpm: BPM(128),
      stepDuration: 0.125,
      barDuration: 0.5,
      numberOfSteps: 16,
      getNextStepTime: () => 0
    };

    adapter = new AudioEngineAdapter(mockTempoService);

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

  it('should update index step by step during playback as AudioContext time advances', () => {
    let intervalCallback: () => void = () => {};
    let intervalId = 0;
    spyOn(window, 'setInterval').and.callFake((...args: any[]) => {
      intervalCallback = args[0] as () => void;
      return ++intervalId;
    });
    spyOn(window, 'clearInterval');

    let mockCurrentTime = 0;
    Object.defineProperty(mockContext, 'currentTime', {
      get: () => mockCurrentTime,
      configurable: true
    });

    adapter.play();

    expect(adapter.isPlaying).toBeTrue();
    expect(adapter.index).toBe(StepIndex(0));

    for (let step = 1; step < mockTempoService.numberOfSteps; step++) {
      mockCurrentTime = mockTempoService.stepDuration * step;
      intervalCallback();
      expect(adapter.index).toBe(StepIndex(step));
    }

    adapter.pause();
    expect(adapter.isPlaying).toBeFalse();
  });

  it('should not update index when paused even if time advances', () => {
    let intervalCallback: () => void = () => {};
    let intervalId = 0;
    spyOn(window, 'setInterval').and.callFake((...args: any[]) => {
      intervalCallback = args[0] as () => void;
      return ++intervalId;
    });
    spyOn(window, 'clearInterval');

    let mockCurrentTime = 0;
    Object.defineProperty(mockContext, 'currentTime', {
      get: () => mockCurrentTime,
      configurable: true
    });

    adapter.play();
    expect(adapter.isPlaying).toBeTrue();

    adapter.pause();
    expect(adapter.isPlaying).toBeFalse();

    mockCurrentTime = mockTempoService.stepDuration * 5;
    intervalCallback();
    expect(adapter.index).toBe(StepIndex(0));
  });

  it('should wrap index around when reaching total number of steps', () => {
    let intervalCallback: () => void = () => {};
    let intervalId = 0;
    spyOn(window, 'setInterval').and.callFake((...args: any[]) => {
      intervalCallback = args[0] as () => void;
      return ++intervalId;
    });
    spyOn(window, 'clearInterval');

    let mockCurrentTime = 0;
    Object.defineProperty(mockContext, 'currentTime', {
      get: () => mockCurrentTime,
      configurable: true
    });

    adapter.play();

    mockCurrentTime = mockTempoService.stepDuration * mockTempoService.numberOfSteps;
    intervalCallback();
    expect(adapter.index).toBe(StepIndex(0));
  });

  it('should start index at 0 regardless of absolute AudioContext time', () => {
    spyOn(window, 'setInterval').and.returnValue(1);
    spyOn(window, 'clearInterval');

    const mockCurrentTime = 100.5;
    Object.defineProperty(mockContext, 'currentTime', {
      get: () => mockCurrentTime,
      configurable: true
    });

    adapter.play();

    expect(adapter.index).toBe(StepIndex(0));

    adapter.pause();
  });

  it('should advance index relative to playStartTime, not absolute time', () => {
    let intervalCallback: () => void = () => {};
    let intervalId = 0;
    spyOn(window, 'setInterval').and.callFake((...args: any[]) => {
      intervalCallback = args[0] as () => void;
      return ++intervalId;
    });
    spyOn(window, 'clearInterval');

    let mockCurrentTime = 100.5;
    Object.defineProperty(mockContext, 'currentTime', {
      get: () => mockCurrentTime,
      configurable: true
    });

    adapter.play();
    expect(adapter.index).toBe(StepIndex(0));

    mockCurrentTime = 100.5 + mockTempoService.stepDuration;
    intervalCallback();
    expect(adapter.index).toBe(StepIndex(1));

    mockCurrentTime = 100.5 + 2 * mockTempoService.stepDuration;
    intervalCallback();
    expect(adapter.index).toBe(StepIndex(2));

    adapter.pause();
  });

  it('should call getNextStepTime with elapsed time relative to playStartTime', () => {
    const mockCurrentTime = 100.5;
    Object.defineProperty(mockContext, 'currentTime', {
      get: () => mockCurrentTime,
      configurable: true
    });

    const spy = spyOn(mockTempoService, 'getNextStepTime').and.returnValue(0);

    adapter.play();

    expect(spy).toHaveBeenCalledWith(Seconds(0), StepIndex(0));
  });
});
