import { CompactBeat } from "./compact-beat";
import { Effect, Option } from "effect";

export interface JsonFilesReaderInterface {
  loadJsonByFileName(fileName: string): Effect.Effect<Option.Option<CompactBeat>, never>

  loadAllJson(): Effect.Effect<Option.Option<CompactBeat>[], never>
}

