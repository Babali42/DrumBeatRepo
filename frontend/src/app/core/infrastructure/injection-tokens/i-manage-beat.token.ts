import { InjectionToken } from "@angular/core";
import IManageBeats from "../../domain/ports/secondary/i-manage-beats";

export const IManageBeatsToken = new InjectionToken<IManageBeats>("IManageBeats");
