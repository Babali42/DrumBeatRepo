import { Effect } from "effect";
import { Beat } from "../beat";
import { Track } from "../track";

export default interface IManageBeats {
  readonly getBeatByFileName: (filename: string) => Effect.Effect<Beat, Error>

  readonly getAllBeats: () => Effect.Effect<readonly Beat[], Error>

  readonly getAllDrumsTracks: () => Effect.Effect<readonly Track[], Error>
}
