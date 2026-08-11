import IManageBeats from "../../../domain/ports/i-manage-beats";
import { Beat } from "../../../domain/beat";
import { Inject, Injectable } from "@angular/core";
import { JsonFilesReaderInterface } from "./json-files-reader.interface";
import { CompactBeatMapper } from "./compact-beat.mapper";
import { jsonFileReaderToken } from "../../injection-tokens/json-file-reader.token";
import { Array, Effect, Option } from "effect";
import { Track } from "src/app/domain/track";

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

  getAllDrumsTracks(): Effect.Effect<Track[], Error> {
    const distinctByFileName = (tracks: Track[]) =>
      Array.dedupeWith(tracks, (a, b) => a.filename === b.filename);

    return this.getAllBeats().pipe(
      Effect.map(beats => beats
        .flatMap(beat => beat.tracks)
        .filter(x => Option.isSome(x.midiNote))),
      Effect.map(distinctByFileName)
    );
  }
}

