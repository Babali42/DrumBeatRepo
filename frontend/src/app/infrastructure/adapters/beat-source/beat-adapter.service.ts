import IManageBeats from "../../../domain/ports/i-manage-beats";
import { Beat } from "../../../domain/beat";
import { Inject, Injectable } from "@angular/core";
import { JsonFilesReaderInterface } from "./json-files-reader.interface";
import { CompactBeatMapper } from "./compact-beat.mapper";
import { jsonFileReaderToken } from "../../injection-tokens/json-file-reader.token";
import { Effect, Option } from "effect";
import { Track } from "src/app/domain/track";

@Injectable({ providedIn: 'root' })
export class BeatAdapter implements IManageBeats {
  constructor(@Inject(jsonFileReaderToken) private readonly jsonFileReader: JsonFilesReaderInterface) {

  }

  getAllBeats(): Effect.Effect<Beat[], Error> {
    return Effect.flatMap(
      this.jsonFileReader.loadAllJson(),
      beats =>
        Effect.all(
          beats.filter(Option.isSome)
            .map(beat => CompactBeatMapper.toBeatEffect(Option.getOrThrow(beat)))
        )
    )
  }

  getAllTracks(): Effect.Effect<Track[], Error> {
    const distinctByFileName = (tracks: Track[]) =>
      Array.from(
        new Map(tracks.map(track => [track.fileName, track])).values()
      );

    return this.getAllBeats().pipe(
      Effect.map(beats => beats.flatMap(beat => beat.tracks)),
      Effect.map(distinctByFileName)
    );
  }
}

