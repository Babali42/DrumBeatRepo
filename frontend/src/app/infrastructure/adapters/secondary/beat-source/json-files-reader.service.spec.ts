import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {JsonFileReader} from "./json-files-reader.service";
import {Effect} from "effect";

describe('JsonLoaderService', () => {
  let service: JsonFileReader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JsonFileReader]
    });

    service = TestBed.inject(JsonFileReader);
  });

  it('should load all JSON files', async () => {
    const mockResponses = [
      {
        "label": "Metal",
        "genre": "Metal",
        "bpm": 180,
        "tracks": [
          {
            "name": "Snare",
            "fileName": "metal/snare.mp3",
            "steps": "____X_______X___"
          },
          {
            "name": "Hats",
            "fileName": "metal/crash.mp3",
            "steps": "X___X___X___X___"
          },
          {
            "name": "Kick",
            "fileName": "metal/kick.mp3",
            "steps": "XXXXXXXXXXXXXXXX"
          }
        ]
      }
    ];

    spyOn(service, 'fromObservable').and.callFake(() =>
      //@ts-ignore
      Effect.tryPromise({ try: () => Promise.resolve(mockResponses) })
    );

    const result = await Effect.runPromise(service.loadAllBeats(['techno.json']));
    expect(result[0]).toBeDefined();
  });

  it('should handle missing files gracefully', async () => {
    spyOn(service, 'fromObservable').and.callFake(() =>
      //@ts-ignore
      Effect.tryPromise({ try: () => Promise.reject('404') })
    );

    const result = await Effect.runPromise(service.loadAllBeats(['missing.json']));
    expect(result[0]).toBeNull(); // if using catchAll / safe variant
  });
});
