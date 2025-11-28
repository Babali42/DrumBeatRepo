import {BeatsGroupedByGenre} from "src/app/core/domain/beatsGroupedByGenre";
import IManageBeats from "../../domain/ports/secondary/i-manage-beats";
import {beatsGroupedByGenre} from "./beat-source/beats-adapter.service";
import {firstValueFrom, of} from "rxjs";

export class InMemoryBeatGateway implements IManageBeats {
  getBeatsGroupedByGenres(): Promise<readonly BeatsGroupedByGenre[]> {
    return firstValueFrom(of(beatsGroupedByGenre));
  }
}
