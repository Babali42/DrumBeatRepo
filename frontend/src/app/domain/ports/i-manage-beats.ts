import { Effect } from "effect";
import { Beat } from "../beat";

export default interface IManageBeats {
  readonly getBeatByFileName: (filename: string) => Effect.Effect<Beat, Error>
}
