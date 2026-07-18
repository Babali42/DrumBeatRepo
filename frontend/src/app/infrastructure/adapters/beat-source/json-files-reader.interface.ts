import { CompactBeat } from "./compact-beat";
import { Effect, Option } from "effect";

export interface JsonFilesReaderInterface {
  loadAllJson(): Effect.Effect<Option.Option<CompactBeat>[], never>
}

