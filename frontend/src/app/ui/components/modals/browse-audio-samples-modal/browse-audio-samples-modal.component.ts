import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from "@ngx-translate/core";
import { BaseModalComponent } from "../base-modal.component";
import { BrowseAudioSamplesModalResult, DefaultBrowseAudioSamplesModalResult } from 'src/app/domain/browse-audio-samples-result/browse-audio-samples-result';
import { SequencerService } from '../../../services/sequencer/sequencer.service';
import { Track } from 'src/app/domain/track';
import {MidiDrumType} from "../../../../domain/midi-drum-type";
import {Option} from "effect";
import {MidiDrumTypeToTextService} from "../../../services/mididrumtype-to-text.service";

@Component({
    selector: 'app-browse-audio-samples-modal',
    standalone: true,
    imports: [FormsModule, CommonModule, TranslatePipe, ReactiveFormsModule],
    templateUrl: "./browse-audio-samples-modal.component.html",
    styleUrl: "../../../../../styles/modals/modal.base.scss"
})
export class BrowseAudioSamplesModalComponent extends BaseModalComponent<BrowseAudioSamplesModalResult> implements OnChanges, OnInit {
    private readonly fb = inject(FormBuilder);

    //todo inject it in angular
    private readonly drumTypeToTextService = new MidiDrumTypeToTextService();

    @Input() override isOpen: boolean = false;

    @Output() override close = new EventEmitter<void>();
    @Output() override validate = new EventEmitter<BrowseAudioSamplesModalResult>();

    tracks: readonly Track[] = [];

    form = this.fb.nonNullable.group({

    })

    constructor(protected readonly sequencerService: SequencerService) {
        super();
    }

    ngOnInit(): void {

    }

    ngOnChanges(): void {

    }

    override options: BrowseAudioSamplesModalResult = DefaultBrowseAudioSamplesModalResult;

    override onValidate(): void {
        this.validate.emit(undefined);
    }

    //TODO : load all samples from scala engine
    //TODO : display the samples grouped by midi drum category
  protected getDrumsCategory(midiNote: Option.Option<MidiDrumType>) : string {
    return Option.getOrElse(this.drumTypeToTextService.getMidiDrumTypeText(midiNote), () => "");
  }
}
