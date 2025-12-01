import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {JsonLoaderService} from "./json-files-reader.service";

describe('JsonLoaderService', () => {
  let service: JsonLoaderService;
  let httpMock: HttpTestingController;

  const basePath = 'assets/data/';
  const files = ['user1.json', 'user2.json', 'user3.json'];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JsonLoaderService]
    });

    service = TestBed.inject(JsonLoaderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load all JSON files', () => {
    const mockResponses = [
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' }
    ];

    service.loadAllJson().subscribe(data => {
      expect(data.length).toBe(3);
      expect(data).toEqual(mockResponses);
    });

    // Expect each request
    files.forEach((file, index) => {
      const req = httpMock.expectOne(basePath + file);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponses[index]); // respond with mock data
    });
  });
});
