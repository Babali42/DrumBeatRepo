import IManageBeats from "../../../domain/ports/i-manage-beats";
import { Beat } from "../../../domain/beat";
import { Inject, Injectable } from "@angular/core";
import { JsonFilesReaderInterface } from "./json-files-reader.interface";
import { CompactBeatMapper } from "./compact-beat.mapper";
import { jsonFileReaderToken } from "../../injection-tokens/json-file-reader.token";
import { Effect, Option } from "effect";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class BeatAdapter implements IManageBeats {
  constructor(@Inject(jsonFileReaderToken) private readonly jsonFileReader: JsonFilesReaderInterface) {

  }

  getAllBeats(): Effect.Effect<Beat[], HttpErrorResponse | Error> {
    return Effect.flatMap(
      this.jsonFileReader.loadAllJson(),
      beats =>
        Effect.all(
          beats.filter(Option.isSome)
            .map(beat => CompactBeatMapper.toBeatEffect(Option.getOrThrow(beat)))
        )
    )
  }
}
