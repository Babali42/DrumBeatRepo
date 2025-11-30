import {Beat} from "../../beat";

export default interface IManageBeats {
  readonly getAllBeats:() => Promise<readonly Beat[]>
}
