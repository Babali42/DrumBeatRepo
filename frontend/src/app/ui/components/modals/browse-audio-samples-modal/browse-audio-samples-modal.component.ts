import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormsModule, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from "@ngx-translate/core";
import { BaseModalComponent } from "../base-modal.component";
import { BrowseAudioSamplesModalResult, DefaultBrowseAudioSamplesModalResult } from 'src/app/domain/browse-audio-samples-result/browse-audio-samples-result';
import { SequencerService } from '../../../services/sequencer/sequencer.service';
import {MidiDrumType} from "../../../../domain/midi-drum-type";
import {Option} from "effect";
import {MidiDrumTypeToTextService} from "../../../services/mididrumtype-to-text.service";
import { WavFilename } from 'src/app/domain/filenames/wav.filepath';
import { Mp3Filename } from 'src/app/domain/filenames/mp3.filepath';

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

    samples: readonly AudioSample[] = [
        {
            name: "Kick",
            filename: "sdfsdf.mp3",
            midiDrumType: Option.some(MidiDrumType.BASS_DRUM_1)
        },
        {
            name: "Kick Gabber",
            filename: "kick2.mp3",
            midiDrumType: Option.some(MidiDrumType.BASS_DRUM_1)
        },
        {
            name: "Snare 1",
            filename: "kick2.mp3",
            midiDrumType: Option.some(MidiDrumType.ELECTRIC_SNARE)
        },
        {
            name: "Acoustic Kick",
            filename: "acoustic-kick.wav",
            midiDrumType: Option.some(MidiDrumType.ACOUSTIC_BASS_DRUM)
        },
        {
            name: "Acoustic Snare",
            filename: "acoustic-snare.wav",
            midiDrumType: Option.some(MidiDrumType.ACOUSTIC_SNARE)
        },
        {
            name: "Hand Clap",
            filename: "hand-clap.mp3",
            midiDrumType: Option.some(MidiDrumType.HAND_CLAP)
        },
        {
            name: "Low Tom",
            filename: "low-tom.wav",
            midiDrumType: Option.some(MidiDrumType.LOW_TOM)
        },
        {
            name: "Closed Hi-Hat",
            filename: "closed-hi-hat.wav",
            midiDrumType: Option.some(MidiDrumType.CLOSED_HI_HAT)
        },
        {
            name: "Open Hi-Hat",
            filename: "open-hi-hat.mp3",
            midiDrumType: Option.some(MidiDrumType.OPEN_HI_HAT)
        },
        {
            name: "Crash Cymbal",
            filename: "crash-cymbal.wav",
            midiDrumType: Option.some(MidiDrumType.CRASH_CYMBAL_1)
        }
    ];

    form = this.fb.group({
        selectedSample: new FormControl<AudioSample | null>(null, Validators.required)
    });

    constructor(protected readonly sequencerService: SequencerService) {
        super();
    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
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

    //TODO : load all samples from scala engine
    get samplesByDrumsCategory(): readonly AudioSampleGroup[] {
        const groups = new Map<string, AudioSample[]>();

        for (const sample of this.samples) {
            const category = this.getDrumsCategory(sample.midiDrumType);
            const categorySamples = groups.get(category) ?? [];
            categorySamples.push(sample);
            groups.set(category, categorySamples);
        }

        return Array.from(groups, ([category, samples]) => ({ category, samples }));
    }

  protected getDrumsCategory(midiDrumType: Option.Option<MidiDrumType>) : string {
    return Option.getOrElse(this.drumTypeToTextService.getMidiDrumTypeText(midiDrumType), () => "");
  }
}

interface AudioSampleGroup {
    readonly category: string;
    readonly samples: readonly AudioSample[];
}

export interface AudioSample {
    readonly name: string,
    readonly filename: WavFilename | Mp3Filename,
    readonly midiDrumType: Option.Option<MidiDrumType>
}