import {InjectionToken} from "@angular/core";
import {IAudioExport} from "../../domain/ports/i-audio-export";

export const AUDIO_EXPORT = new InjectionToken<IAudioExport>('AudioExport');
