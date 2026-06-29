import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {provideTranslateService} from '@ngx-translate/core';
import {ExportMidiModalComponent} from "./export-midi-modal.component";

describe('ExportMidiModalComponent', () => {
  let component: ExportMidiModalComponent;
  let fixture: ComponentFixture<ExportMidiModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportMidiModalComponent],
      providers: [provideTranslateService({
        lang: 'en',
        fallbackLang: 'en'
      })]
    }).compileComponents();

    fixture = TestBed.createComponent(ExportMidiModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display modal when isOpen is false', () => {
    component.isOpen = false;
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.modal-overlay'));
    expect(overlay).toBeNull();
  });

  it('should display modal when isOpen is true', () => {
    component.isOpen = true;
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.modal-overlay'));
    expect(overlay).toBeTruthy();
  });

  it('should display beat name when provided', () => {
    component.isOpen = true;
    component.beatName = 'My Awesome Beat';
    component.ngOnChanges({
      beatName: {
        currentValue: 'My Awesome Beat',
        previousValue: '',
        firstChange: true,
        isFirstChange: () => true
      }
    });
    fixture.detectChanges();

    expect(component.form.controls.fileName.value)
      .toBe('My Awesome Beat.mid');
  });

  it('should emit close event when close button is clicked', () => {
    spyOn(component.close, 'emit');
    component.isOpen = true;
    fixture.detectChanges();

    const closeBtn = fixture.debugElement.query(By.css('.close-btn'));
    closeBtn.nativeElement.click();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit close event when cancel button is clicked', () => {
    spyOn(component.close, 'emit');
    component.isOpen = true;
    fixture.detectChanges();

    const cancelBtn = fixture.debugElement.query(By.css('.btn-secondary'));
    cancelBtn.nativeElement.click();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit close event when clicking on overlay', () => {
    spyOn(component.close, 'emit');
    component.isOpen = true;
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.modal-overlay'));
    overlay.nativeElement.click();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should not emit close when clicking inside modal content', () => {
    spyOn(component.close, 'emit');
    component.isOpen = true;
    fixture.detectChanges();

    const modalContent = fixture.debugElement.query(By.css('.modal-content'));
    modalContent.nativeElement.click();

    expect(component.close.emit).not.toHaveBeenCalled();
  });

  it('should not emit export event if form is invalid', () => {
    spyOn(component.export, 'emit');
    component.isOpen = true;
    fixture.detectChanges();

    component.form.controls.fileName.setValue("test.mp3" as any);
    component.onExport();

    expect(component.export.emit).not.toHaveBeenCalled();
  });
});
