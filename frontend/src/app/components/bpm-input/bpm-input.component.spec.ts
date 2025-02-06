import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmInputComponent } from './bpm-input.component';
import {By} from "@angular/platform-browser";

describe('BpmInputComponent', () => {
  let component: BpmInputComponent;
  let fixture: ComponentFixture<BpmInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BpmInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpmInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increment the bpm in the desired range', () => {
    //Arrange
    component.maxBpm = 130;
    component.bpm = 128;

    //Act
    component.incrementBpm();
    component.incrementBpm();
    component.incrementBpm();

    //Assert
    expect(component.bpm).toEqual(component.maxBpm);
  });

  it('should decrement the bpm in the desired range', () => {
    //Arrange
    component.minBpm = 126;
    component.bpm = 128;

    //Act
    component.decrementBpm();
    component.decrementBpm();
    component.decrementBpm();

    //Assert
    expect(component.bpm).toEqual(component.minBpm);
  });

  it('should update the value', () => {
    //Arrange
    component.bpm = 128;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const inputElement = fixture.debugElement.query(By.css('.number-quantity')).nativeElement;

    //Act
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    inputElement.value = '120';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
    inputElement.dispatchEvent(new Event('change'));

    //Assert
    fixture.detectChanges();
    expect(component.bpm).toBe(120);
  });
});
