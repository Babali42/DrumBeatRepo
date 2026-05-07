import {InjectionToken} from "@angular/core";
import {IMidi} from "../../domain/ports/i-midi";

export const IMIDI = new InjectionToken<IMidi>('IMidiExport');
