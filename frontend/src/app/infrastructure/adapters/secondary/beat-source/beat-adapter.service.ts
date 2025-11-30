import IManageBeats from "../../../../core/domain/ports/secondary/i-manage-beats";
import {beats} from "./beats.persistence";
import {firstValueFrom, of} from "rxjs";
import {Beat} from "../../../../core/domain/beat";
import {CompactBeatMapper} from "./compact-beat.mapper";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class BeatAdapter implements IManageBeats {
  getAllBeats(): Promise<readonly Beat[]> {
    return firstValueFrom(of(beats.map(CompactBeatMapper.toBeat)));
  }
}
