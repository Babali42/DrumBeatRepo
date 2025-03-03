import { BeatsGroupedByGenre } from "src/app/domain/beatsGroupedByGenre";
import IManageBeats from "../../domain/ports/secondary/i-manage-beats";
import {beatsGroupedByGenre} from "./beats/beats-in-memory-data";

export class InMemoryBeatGateway implements IManageBeats {
  private val: BeatsGroupedByGenre[] = [{
    label: "Techno",
    beats: []
  } as BeatsGroupedByGenre];
    getBeatsGroupedByGenres(): Promise<BeatsGroupedByGenre[]> {
        return new Promise((resolve) => {
        setTimeout(() => {
          resolve(beatsGroupedByGenre);
        }, 300);
      });
    }
}
