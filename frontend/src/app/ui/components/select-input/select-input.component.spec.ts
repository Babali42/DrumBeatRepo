import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectInputComponent } from './select-input.component';

describe('SelectInputComponent', () => {
  let component: SelectInputComponent;
  let fixture: ComponentFixture<SelectInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit onSelectChange when a new option is selected', () => {
    //Arrange
    spyOn(component.selectChange, 'emit');

    //Act
    fixture.componentRef.setInput('selectedElement', 'gabber');
    component.onSelectChange('gabber');

    //Assert
    expect(component.selectChange.emit).toHaveBeenCalledWith('gabber');
  });
});
