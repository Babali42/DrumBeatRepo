import { InjectionToken } from "@angular/core";
import IManageBeats from "../../core/domain/ports/secondary/i-manage-beats";

export const IManageBeatsToken = new InjectionToken<IManageBeats>("IManageBeats");
