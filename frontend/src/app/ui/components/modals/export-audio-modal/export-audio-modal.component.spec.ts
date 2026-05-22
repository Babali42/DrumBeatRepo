import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ExportAudioModalComponent} from './export-audio-modal.component';
import {By} from '@angular/platform-browser';
import {TranslateModule} from '@ngx-translate/core';
import {provideTranslateService} from '@ngx-translate/core';

describe('ExportAudioModalComponent', () => {
  let component: ExportAudioModalComponent;
  let fixture: ComponentFixture<ExportAudioModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportAudioModalComponent, TranslateModule.forRoot()],
      providers: [provideTranslateService({
        lang: 'en',
        fallbackLang: 'en'
      })]
    }).compileComponents();

    fixture = TestBed.createComponent(ExportAudioModalComponent);
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
    fixture.detectChanges();

    const beatNameInput = fixture.debugElement.query(By.css('.beat-name-input'));
    expect(beatNameInput.nativeElement.value).toBe('My Awesome Beat');
  });

  it('should have wav as default format', () => {
    expect(component.options.format).toBe('wav');
  });

  it('default export with tail option should be true', () => {
    expect(component.options.exportWithTail).toBeTruthy();
  });

  it('should emit close event when close button is clicked', () => {
    spyOn(component.close, 'emit');
    component.isOpen = true;
    fixture.detectChanges();

    const closeBtn = fixture.debugElement.query(By.css('.close-btn'));
    closeBtn.nativeElement.click();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit export event with options when export button is clicked', () => {
    spyOn(component.export, 'emit');
    component.isOpen = true;
    fixture.detectChanges();

    const exportBtn = fixture.debugElement.query(By.css('.btn-primary'));
    exportBtn.nativeElement.click();

    expect(component.export.emit).toHaveBeenCalled();
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

  it('should update loop count option when select changes', () => {
    component.isOpen = true;
    fixture.detectChanges();

    component.options.loopCount = 2;
    fixture.detectChanges();

    expect(component.options.loopCount).toBe(2);
  });

  it('should update quality option when select changes', () => {
    component.isOpen = true;
    fixture.detectChanges();

    component.options.quality = 320;
    fixture.detectChanges();

    expect(component.options.quality).toBe(320);
  });

  it('should emit export with updated options', () => {
    spyOn(component.export, 'emit');
    component.isOpen = true;
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
      quality: 320,
      exportWithTail: true,
    });
  });
});
