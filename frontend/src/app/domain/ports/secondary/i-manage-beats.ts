import {BeatsGroupedByGenre} from "../../beatsGroupedByGenre";

export default interface IManageBeats {
  getBeatsGroupedByGenres(): Promise<BeatsGroupedByGenre[]>
}
