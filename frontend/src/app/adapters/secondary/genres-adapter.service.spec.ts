import {HttpClient} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {of, throwError} from 'rxjs';
import {GenresAdapterService} from "./genres-adapter.service";
import {Genre} from "../../domain/genre";
import {Beat} from "../../domain/beat";

describe('GenreAdapterService', () => {
  let service: GenresAdapterService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get', 'post', 'put', 'delete']);
    TestBed.configureTestingModule({
      providers: [{provide: HttpClient, useValue: httpClientSpy}]
    });
    service = TestBed.inject(GenresAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected genres', async () => {
    // Arrange
    const seed: Beat[] = [
      {id: "1", label: "4 on the floor", bpm: 128, genre: "Techno"} as Beat,
      {id: "2", label: "Gabber", bpm: 200, genre: "Techno"} as Beat,
      {id: "3", label: "Trance", bpm: 200, genre: "Trance"} as Beat];
    httpClientSpy.get.and.returnValue(of(seed));

    // Act
    var genres = await service.getGenres();

    // Assert
    const expectedResult: Genre[] = [{
      label: "Techno", beats:
        [{id: "1", label: "4 on the floor", bpm: 128, genre: "Techno"} as Beat,
          {id: "2", label: "Gabber", bpm: 200, genre: "Techno"} as Beat]
    }, {label: "Trance", beats: [{id: "3", label: "Trance", bpm: 200, genre: "Trance"} as Beat]}];
    expect(genres).toEqual(expectedResult);
    expect(httpClientSpy.get).toHaveBeenCalledOnceWith('api/beats');
  });

  it('should return an error getting genres when the server returns a 404', (done: DoneFn) => {

    const errorResponse = {
      body: {error: 'test 404 error'},
      status: 404, statusText: 'Not Found'
    };

    httpClientSpy.get.and.returnValue(throwError(() => errorResponse));

    service.getGenres()
      .then(() => {
      })
      .catch((error) => {
        expect(error.name).toEqual('(FiberFailure) Error');
        expect(error.message).toContain('Can\'t get genres');
        done();
      });
  });
});
