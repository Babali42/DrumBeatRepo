import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from './app.module';
import { Location } from '@angular/common';

describe('Router', () => {
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes)
      ]
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should render the main page', fakeAsync (() => {
    //Act
    router.navigate(['/']);
    tick();

    //Assert
    expect(location.path()).toBe('/');
  }));

  it('should render the add beat page', fakeAsync (() => {
    //Act
    router.navigate(['/add-beat']);
    tick();

    //Assert
    expect(location.path()).toBe('/add-beat');
  }));
});
