import { inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { firstValueFrom } from "rxjs";
import { MidiDrumType } from "src/app/domain/midi-drum-type";

@Injectable({ providedIn: 'root' })
export class MidiDrumTypeToTextService {
    private translateService = inject(TranslateService);

    async getMidiDrumTypeText(value: MidiDrumType): Promise<string> {
        return firstValueFrom<string>(
            this.translateService.get(`MidiDrumType.${value}`)
        );
    }
}