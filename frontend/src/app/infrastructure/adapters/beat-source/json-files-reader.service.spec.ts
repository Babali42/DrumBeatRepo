import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JsonFileReader } from "./json-files-reader.service";
import { Effect, Option } from "effect";

describe('JsonLoaderService', () => {
  let service: JsonFileReader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(JsonFileReader);
  });

  it('should load all JSON files', async () => {
    const mockResponses = [
      {
        "label": "Metal",
        "genre": "Metal",
        "bpm": 180,
        "beatsPerBar": 4,
        "subdivisionsPerBeat": 3,
        "numberOfBar": 1,
        "tracks": [
          {
            "name": "Snare",
            "filename": "metal/snare.mp3",
            "steps": "____X_______X___"
          },
          {
            "name": "Hats",
            "filename": "metal/crash.mp3",
            "steps": "X___X___X___X___"
          },
          {
            "name": "Kick",
            "filename": "metal/kick.mp3",
            "steps": "XXXXXXXXXXXXXXXX"
          }
        ]
      }];

    spyOn(service, 'fromObservable').and.callFake(() =>
      //@ts-expect-error: fromObservable type mismatch
      Effect.tryPromise({ try: () => Promise.resolve(mockResponses[0]) })
    );

    const result = await Effect.runPromise(service.loadAllBeats(['techno.json']));
    expect(Option.isSome(result[0])).toBeTrue();
    expect((Option.getOrThrow(result[0])).tracks).toBeDefined();
    expect((Option.getOrThrow(result[0])).beatsPerBar).toEqual(4);
    expect((Option.getOrThrow(result[0])).subdivisionsPerBeat).toEqual(3);
  });

  it('should handle missing files gracefully', async () => {
    spyOn(service, 'fromObservable').and.callFake(() =>
      //@ts-expect-error: fromObservable type mismatch
      Effect.tryPromise({ try: () => Promise.reject(new Error('404')) })
    );

    const result = await Effect.runPromise(service.loadAllBeats(['missing.json']));
    expect(Option.isNone(result[0])).toBeTrue();
  });
});
