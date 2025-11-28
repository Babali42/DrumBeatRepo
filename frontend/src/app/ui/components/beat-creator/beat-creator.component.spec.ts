import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeatCreatorComponent } from './beat-creator.component';

describe('BeatCreatorComponent', () => {
  let component: BeatCreatorComponent;
  let fixture: ComponentFixture<BeatCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeatCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeatCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
