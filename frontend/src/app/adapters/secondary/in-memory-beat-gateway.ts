import {BeatsGroupedByGenre} from "src/app/domain/beatsGroupedByGenre";
import IManageBeats from "../../domain/ports/secondary/i-manage-beats";
import {beatsGroupedByGenre} from "./beats/beats-in-memory-data";
import {firstValueFrom, of} from "rxjs";

export class InMemoryBeatGateway implements IManageBeats {
  getBeatsGroupedByGenres(): Promise<BeatsGroupedByGenre[]> {
    return firstValueFrom(of(beatsGroupedByGenre));
  }
}
