import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from "@ngx-translate/core";
import { BaseModalComponent } from "../base-modal.component";
import { BrowseAudioSamplesModalResult, DefaultBrowseAudioSamplesModalResult } from 'src/app/domain/browse-audio-samples-result/browse-audio-samples-result';
import { SequencerService } from '../../sequencer/sequencer.service';
import { Track } from 'src/app/domain/track';
import { MidiDrumTypeToTextService } from 'src/app/ui/services/mididrumtype-to-text.service';

@Component({
    selector: 'app-browse-audio-samples-modal',
    standalone: true,
    imports: [FormsModule, CommonModule, TranslatePipe, ReactiveFormsModule],
    templateUrl: "./browse-audio-samples-modal.component.html",
    styleUrl: "../../../../../styles/modals/modal.base.scss"
})
export class BrowseAudioSamplesModalComponent extends BaseModalComponent<BrowseAudioSamplesModalResult> implements OnChanges, OnInit {
    private readonly fb = inject(FormBuilder);

    @Input() override isOpen: boolean = false;

    @Output() override close = new EventEmitter<void>();
    @Output() override validate = new EventEmitter<BrowseAudioSamplesModalResult>();

    tracks: readonly Track[] = [];

    form = this.fb.nonNullable.group({

    })

    constructor(protected readonly sequencerService: SequencerService, protected readonly midiDrumTypeToTextService: MidiDrumTypeToTextService) {
        super();
    }

    ngOnInit(): void {
        void this.sequencerService.getTracks().then(x => {
            this.tracks = x;
        });
    }

    ngOnChanges(): void {

    }

    override options: BrowseAudioSamplesModalResult = DefaultBrowseAudioSamplesModalResult;

    override onValidate(): void {
        this.validate.emit(undefined);
    }
}
