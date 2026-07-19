import { Effect } from "effect";
import { Beat } from "../beat";
import { Track } from "../track";

export default interface IManageBeats {
  readonly getAllBeats: () => Effect.Effect<Beat[], Error>

  readonly getAllTracks: () => Effect.Effect<Track[], Error>
}
