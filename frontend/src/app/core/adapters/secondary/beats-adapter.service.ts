import {Injectable} from '@angular/core';
import IManageBeats from "../../domain/ports/secondary/i-manage-beats";
import {BeatsGroupedByGenre} from "../../domain/beatsGroupedByGenre";
import {beatsGroupedByGenre} from "./beat-source/beats-adapter.service";
import {firstValueFrom, of} from "rxjs";

@Injectable({providedIn: 'root'})
export class BeatsAdapterService implements IManageBeats {
  getBeatsGroupedByGenres = (): Promise<readonly BeatsGroupedByGenre[]> => {
    return firstValueFrom(of(beatsGroupedByGenre));
  };
}

