import IManageBeats from "../../../../core/domain/ports/secondary/i-manage-beats";
import {firstValueFrom, map} from "rxjs";
import {Beat} from "../../../../core/domain/beat";
import {Inject, Injectable} from "@angular/core";
import {JsonFilesReaderInterface} from "./json-files-reader.interface";
import {CompactBeatMapper} from "./compact-beat.mapper";
import {jsonFileReaderToken} from "../../../injection-tokens/json-file-reader.token";
import {Effect} from "effect";

@Injectable({providedIn: 'root'})
export class BeatAdapter implements IManageBeats {
  constructor(@Inject(jsonFileReaderToken) private readonly jsonFileReader: JsonFilesReaderInterface) {

  }

  getAllBeats(): Promise<readonly Beat[]> {
    return firstValueFrom(this.jsonFileReader.loadAllJson()
      .pipe(
        map(beats => beats.filter(x => x != null)),
        map(beats => Effect.all(
          beats.map(b => CompactBeatMapper.toBeatEffect(b!)),
          { discard: false, mode: 'either' }
        )),
        map(effect => Effect.runSync(effect).filter(x => x._tag === 'Right').map(x => x.right))
      ))
  }
}
