import IManageBeats from "../../domain/ports/secondary/i-manage-beats";
import {beatsGroupedByGenre} from "./beat-source/beats-adapter.service";
import {firstValueFrom, of} from "rxjs";
import {Beat} from "../../domain/beat";
import {CompactBeatMapper} from "./compact-beat.mapper";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class InMemoryBeatGateway implements IManageBeats {
  getAllBeats(): Promise<readonly Beat[]> {
    return firstValueFrom(of(beatsGroupedByGenre.map(CompactBeatMapper.toBeat)));
  }
}
