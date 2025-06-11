import {BeatsGroupedByGenre} from "../../beatsGroupedByGenre";

export default interface IManageBeats {
  readonly getBeatsGroupedByGenres:() => Promise<readonly BeatsGroupedByGenre[]>
}
