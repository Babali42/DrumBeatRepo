import { Effect } from "effect";
import { Beat } from "../beat";
import { Track } from "../track";
import {BeatMetadata} from "../beat-metadata";

export default interface IManageBeats {
  readonly getBeatByFileName: (filename: string) => Effect.Effect<Beat, Error>

  readonly getBeatsManifest: () => Effect.Effect<readonly BeatMetadata[], Error>

  readonly getAllDrumsTracks: () => Effect.Effect<readonly Track[], Error>
}
