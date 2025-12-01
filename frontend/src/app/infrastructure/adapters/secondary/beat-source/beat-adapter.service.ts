import IManageBeats from "../../../../core/domain/ports/secondary/i-manage-beats";
import {firstValueFrom, map} from "rxjs";
import {Beat} from "../../../../core/domain/beat";
import {Inject, Injectable} from "@angular/core";
import {JsonFilesReaderInterface} from "./json-files-reader.interface";
import {CompactBeatMapper} from "./compact-beat.mapper";
import {jsonFileReaderToken} from "../../../injection-tokens/json-file-reader.token";

@Injectable({providedIn: 'root'})
export class BeatAdapter implements IManageBeats {
  constructor(@Inject(jsonFileReaderToken) private readonly jsonFileReader: JsonFilesReaderInterface) {

  }

  getAllBeats(): Promise<readonly Beat[]> {
    return firstValueFrom(this.jsonFileReader.loadAllJson()
      .pipe(map(beat => beat.map(CompactBeatMapper.toBeat))));
  }
}
