import IManageBeats from "../../../domain/ports/i-manage-beats";
import { Beat } from "../../../domain/beat";
import { Inject, Injectable } from "@angular/core";
import { JsonFilesReaderInterface } from "./json-files-reader.interface";
import { CompactBeatMapper } from "./compact-beat.mapper";
import { jsonFileReaderToken } from "../../injection-tokens/json-file-reader.token";
import { Array, Effect, Option } from "effect";
import { Track } from "src/app/domain/track";
import { BEATS_MANIFEST} from "../../../../assets/beats/beats-manifest";
import { BeatMetadata } from "../../../domain/beat-metadata";

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

  getBeatsManifest(): Effect.Effect<BeatMetadata[], Error> {
    // Dynamically fetch all beats using our lightweight manifest
    return Effect.succeed(BEATS_MANIFEST)
  }

  getAllDrumsTracks(): Effect.Effect<Track[], Error> {
    return this.getBeatsManifest().pipe(
      Effect.flatMap(beats =>
        Effect.all(
          beats.map(beat => this.getBeatByFileName(beat.filename))
        )
      ),
      Effect.map(beats =>
        beats.flatMap(beat =>
          beat.tracks.filter(track => Option.isSome(track.midiNote))
        )
      ),
      Effect.map(tracks =>
        Array.dedupeWith(tracks, (a, b) => a.filename === b.filename)
      )
    );
  }
}

