import {Observable} from "rxjs";
import {CompactBeat} from "./compact-beat";

export interface JsonFilesReaderInterface {
  loadAllJson(): Observable<readonly (CompactBeat | null)[]>
}

