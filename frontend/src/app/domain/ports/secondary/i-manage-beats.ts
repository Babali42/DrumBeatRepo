import {BeatsGroupedByGenre} from "../../beatsGroupedByGenre";
import {InjectionToken} from "@angular/core";

export default interface IManageBeats {
  getBeatsGroupedByGenres(): Promise<BeatsGroupedByGenre[]>
}

export const IManageBeatsToken = new InjectionToken<IManageBeats>('IManageBeats');
