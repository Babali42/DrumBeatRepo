import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ExportModalComponent} from './export-modal.component';
import {By} from '@angular/platform-browser';

describe('ExportModalComponent', () => {
  let component: ExportModalComponent;
  let fixture: ComponentFixture<ExportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ExportModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display modal when isOpen is false', () => {
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.modal-overlay'));
    expect(overlay).toBeNull();
  });

  it('should display modal when isOpen is true', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.modal-overlay'));
    expect(overlay).toBeTruthy();
  });

  it('should display beat name when provided', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('beatName', 'My Awesome Beat');
    fixture.detectChanges();

    const beatNameInput = fixture.debugElement.query(By.css('.beat-name-input'));
    expect(beatNameInput.nativeElement.value).toBe('My Awesome Beat');
  });

  it('should have mp3 as default format', () => {
    expect(component.options.format).toBe('mp3');
  });

  it('should have 1 loop as default duration', () => {
    expect(component.options.loopCount).toBe(1);
  });

  it('should have 192kbps as default quality', () => {
    expect(component.options.quality).toBe(192);
  });

  it('should emit close event when close button is clicked', () => {
    spyOn(component.close, 'emit');
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const closeBtn = fixture.debugElement.query(By.css('.close-btn'));
    closeBtn.nativeElement.click();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit export event with options when export button is clicked', () => {
    spyOn(component.export, 'emit');
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const exportBtn = fixture.debugElement.query(By.css('.btn-primary'));
    exportBtn.nativeElement.click();

    expect(component.export.emit).toHaveBeenCalledWith({
      format: 'mp3',
      loopCount: 1,
      quality: 192
    });
  });

  it('should emit close event when cancel button is clicked', () => {
    spyOn(component.close, 'emit');
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const cancelBtn = fixture.debugElement.query(By.css('.btn-secondary'));
    cancelBtn.nativeElement.click();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit close event when clicking on overlay', () => {
    spyOn(component.close, 'emit');
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.modal-overlay'));
    overlay.nativeElement.click();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should not emit close when clicking inside modal content', () => {
    spyOn(component.close, 'emit');
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const modalContent = fixture.debugElement.query(By.css('.modal-content'));
    modalContent.nativeElement.click();

    expect(component.close.emit).not.toHaveBeenCalled();
  });

  it('should update loop count option when select changes', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    component.options.loopCount = 2;
    fixture.detectChanges();

    expect(component.options.loopCount).toBe(2);
  });

  it('should update quality option when select changes', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    component.options.quality = 320;
    fixture.detectChanges();

    expect(component.options.quality).toBe(320);
  });

  it('should emit export with updated options', () => {
    spyOn(component.export, 'emit');
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    component.options.format = 'wav';
    component.options.loopCount = 4;
    component.options.quality = 320;
    fixture.detectChanges();

    const exportBtn = fixture.debugElement.query(By.css('.btn-primary'));
    exportBtn.nativeElement.click();

    expect(component.export.emit).toHaveBeenCalledWith({
      format: 'wav',
      loopCount: 4,
      quality: 320
    });
  });
});
