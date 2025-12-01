import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {JsonFileReader} from "./json-files-reader.service";

describe('JsonLoaderService', () => {
  let service: JsonFileReader;
  let httpMock: HttpTestingController;

  const basePath = 'assets/beats/';
  const files = ['metal-metal.json'];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JsonFileReader]
    });

    service = TestBed.inject(JsonFileReader);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should load all JSON files', () => {
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

    service.loadAllJson().subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].bpm).toEqual(180);
      expect(data[0].label).toEqual("Metal");
      expect(data[0].genre).toEqual("Metal");
      expect(data[0].tracks[0].steps).toEqual("____X_______X___");
    });

    // Expect each request
    files.forEach((file, index) => {
      const req = httpMock.expectOne(basePath + file);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponses[index]); // respond with mock data
    });
  });
});
