import IManageBeats from "../../../../core/domain/ports/secondary/i-manage-beats";
import {firstValueFrom, of} from "rxjs";
import {Beat} from "../../../../core/domain/beat";
import {Inject, Injectable} from "@angular/core";
import {JSON_TOKEN, JsonFileReaderInterface} from "./jsonFileReaderInterface";

@Injectable({providedIn: 'root'})
export class BeatAdapter implements IManageBeats {
  constructor(@Inject(JSON_TOKEN) private jsonFileReader: JsonFileReaderInterface) {

  }

  getAllBeats(): Promise<readonly Beat[]> {
    //return firstValueFrom(of(beats.map(CompactBeatMapper.toBeat)));
    return firstValueFrom(this.jsonFileReader.loadAllJson());
  }
}
