import IManageBeats from "../../../domain/ports/i-manage-beats";
import { Beat } from "../../../domain/beat";
import { Inject, Injectable } from "@angular/core";
import { JsonFilesReaderInterface } from "./json-files-reader.interface";
import { CompactBeatMapper } from "./compact-beat.mapper";
import { jsonFileReaderToken } from "../../injection-tokens/json-file-reader.token";
import { Effect, Option } from "effect";

@Injectable({ providedIn: 'root' })
export class BeatAdapter implements IManageBeats {
  constructor(@Inject(jsonFileReaderToken) private readonly jsonFileReader: JsonFilesReaderInterface) {

  }

  getBeatByFileName(name: string): Effect.Effect<Beat, Error> {
    return Effect.flatMap(
      this.jsonFileReader.loadJsonByFileName(name),
      beat => CompactBeatMapper.toBeatEffect(Option.getOrThrow(beat))
    )
  }
}

