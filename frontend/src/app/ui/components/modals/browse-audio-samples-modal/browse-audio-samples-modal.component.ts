import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormsModule, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from "@ngx-translate/core";
import { BaseModalComponent } from "../base-modal.component";
import { BrowseAudioSamplesModalResult, DefaultBrowseAudioSamplesModalResult } from 'src/app/domain/browse-audio-samples-result/browse-audio-samples-result';
import { SequencerService } from '../../../services/sequencer/sequencer.service';
import { MidiDrumTypeToTextService } from "../../../services/mididrumtype-to-text.service";
import {DrumSample, DrumSampleGroup} from "../../../../../types/engine";

@Component({
    selector: 'app-browse-audio-samples-modal',
    standalone: true,
    imports: [FormsModule, CommonModule, TranslatePipe, ReactiveFormsModule],
    templateUrl: "./browse-audio-samples-modal.component.html",
    styleUrl: "../../../../../styles/modals/modal.base.scss"
})
export class BrowseAudioSamplesModalComponent extends BaseModalComponent<BrowseAudioSamplesModalResult> implements OnChanges {
    private readonly fb = inject(FormBuilder);

    //todo inject it in angular
    private readonly drumTypeToTextService = new MidiDrumTypeToTextService();

    samplesByDrumsCategory: DrumSampleGroup[] = [];

    @Input() override isOpen: boolean = false;

    @Output() override close = new EventEmitter<void>();
    @Output() override validate = new EventEmitter<BrowseAudioSamplesModalResult>();

    form = this.fb.group({
        // eslint-disable-next-line @typescript-eslint/unbound-method
        selectedSample: new FormControl<DrumSample | null>(null, Validators.required)
    });

    constructor(protected readonly sequencerService: SequencerService) {
        super();
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['isOpen']?.currentValue === true) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-return
        SequencerEngine.getDrumSamples().then(x => this.samplesByDrumsCategory = x);
      }

        if (changes['isOpen']?.currentValue === false) {
            this.form.controls.selectedSample.reset();
        }
    }

    override options: BrowseAudioSamplesModalResult = DefaultBrowseAudioSamplesModalResult;

    override onClose(): void {
        this.form.controls.selectedSample.reset();
        super.onClose();
    }

    override onValidate(): void {
        this.validate.emit(undefined);
    }
}
