import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BpmInputComponent } from './bpm-input.component';
import {By} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";

type BeatChangeDataSet = {
  min: number;
  max: number;
  actual: number;
  expected: number;
};

describe('BpmInputComponent', () => {
  let component: BpmInputComponent;
  let fixture: ComponentFixture<BpmInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(BpmInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const riseTempoCases: BeatChangeDataSet[] = [
    { min: 120, max: 128, actual: 127 , expected: 128 },
    { min: 120, max: 128, actual: 128 , expected: 128 },
  ];

  riseTempoCases.forEach(({ min, max, actual, expected }) => {
    it('should increment the bpm in the range', () => {
      component.maxBpm = max;
      component.minBpm = min;
      fixture.componentRef.setInput('bpm', actual);
      fixture.detectChanges();

      component.incrementBpm();

      expect(component.form.controls.bpm.value).toBe(expected);
    });
  });

  const lowerTempoCases: BeatChangeDataSet[] = [
    { min: 120, max: 128, actual: 121 , expected: 120 },
    { min: 120, max: 128, actual: 120 , expected: 120 },
  ];

  lowerTempoCases.forEach(({ min, max, actual, expected }) => {
    it('should decrement the bpm in the range', () => {
      component.maxBpm = max;
      component.minBpm = min;
      fixture.componentRef.setInput('bpm', actual);
      fixture.detectChanges();

      component.decrementBpm();

      expect(component.form.controls.bpm.value).toBe(expected);
    });
  });

  it('should emit updated value on input', () => {
    fixture.componentRef.setInput('bpm', 128);
    fixture.detectChanges();

    let lastValue!: number;
    component.bpmChange.subscribe(v => lastValue = v);

    const input = fixture.debugElement.query(
      By.css('.number-quantity')
    ).nativeElement as HTMLInputElement;

    input.value = '120';
    input.dispatchEvent(new Event('input'));

    expect(lastValue).toBe(120);
  });

  it('should be valid when the field is filled in correctly', () => {
    component.form.controls.bpm.setValue(120);
    expect(component.form.valid).toBe(true);
  });

  it('should not be valid when the field is empty', () => {
    component.form.controls.bpm.setValue(null);
    expect(component.form.valid).toBe(false);
  });

  it('should not be valid when the bpm is out of bounds (min)', () => {
    component.form.controls.bpm.setValue(1);
    expect(component.form.valid).toBe(false);
  });

  it('should not be valid when the bpm is out of bounds (max)', () => {
    component.form.controls.bpm.setValue(100000);
    expect(component.form.valid).toBe(false);
  });
});
