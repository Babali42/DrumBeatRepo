import { inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { MidiDrumType } from "src/app/domain/midi-drum-type";
import { Option } from "effect";

@Injectable({ providedIn: 'root' })
export class MidiDrumTypeToTextService {
    private readonly translateService = inject(TranslateService);

    getMidiDrumTypeText(value: Option.Option<MidiDrumType>): string {
        if (Option.isNone(value))
            return "";

        return this.translateService.instant(
            `MidiDrumType.${Option.getOrThrow(value)}`
        ) as string;
    }
}