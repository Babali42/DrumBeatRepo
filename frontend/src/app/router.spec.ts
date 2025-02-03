import { TestBed } from '@angular/core/testing';
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

  it('should render the main page', async () => {
    await router.navigate(['/']);
    expect(location.path()).toBe('/');
  });

  it('should render the add beat page', async () => {
    await router.navigate(['/add-beat']);
    expect(location.path()).toBe('/add-beat');
  });
});
