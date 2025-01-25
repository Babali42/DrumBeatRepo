import { HttpClient } from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {of, throwError} from 'rxjs';
import {GenresAdapterService} from "./genres-adapter.service";
import {Genre} from "../../domain/genre";

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

  it('should return expected genres', (done: DoneFn) => {
    // Arrange
    const dbGenres: Genre[] =
      [{label: "A", beats: []}, {label: "B", beats: []}];
    httpClientSpy.get.and.returnValue(of(dbGenres));

    // Act
    service.getGenres().then(genres => {

      // Assert
      const expectedGenres: Genre[] =
        [{label: "A", beats: []}, {label: "B", beats: []}];
      expect(genres).toEqual(expectedGenres);
      done()
    }).catch(() => {
    });

    // Assert
    expect(httpClientSpy.get).toHaveBeenCalledOnceWith('api/genres');
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
