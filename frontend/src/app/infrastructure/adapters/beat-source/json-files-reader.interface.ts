import { HttpErrorResponse } from "@angular/common/http";
import { CompactBeat } from "./compact-beat";
import { Effect } from "effect";

export interface JsonFilesReaderInterface {
  loadAllJson(): Effect.Effect<readonly (CompactBeat | null)[], HttpErrorResponse>
}

