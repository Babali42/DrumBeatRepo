import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';
import { SequencerService } from '../../../services/sequencer/sequencer.service';
import { BrowseAudioSamplesModalComponent } from './browse-audio-samples-modal.component';

describe('BrowseAudioSamplesModalComponent', () => {
  let component: BrowseAudioSamplesModalComponent;
  let fixture: ComponentFixture<BrowseAudioSamplesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseAudioSamplesModalComponent],
      providers: [
        provideTranslateService({
          lang: 'en',
          fallbackLang: 'en'
        }),
        { provide: SequencerService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BrowseAudioSamplesModalComponent);
    component = fixture.componentInstance;
    component.isOpen = true;
    fixture.detectChanges();
  });

  it('should clear the selected sample when the modal is closed', () => {
    const selectedSample = component.samples[0];
    component.form.controls.selectedSample.setValue(selectedSample);
    fixture.detectChanges();

    expect(component.form.valid).toBe(true);
    expect(fixture.debugElement.query(By.css('.btn-primary')).nativeElement.disabled).toBe(false);

    fixture.debugElement.query(By.css('.close-btn')).nativeElement.click();
    fixture.detectChanges();

    expect(component.form.controls.selectedSample.value).toBeNull();
    expect(component.form.valid).toBe(false);
    expect(fixture.debugElement.query(By.css('.btn-primary')).nativeElement.disabled).toBe(true);
  });
});