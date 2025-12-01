import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {JsonFilesReaderInterface} from "./json-files-reader.interface";
import {CompactBeat} from "./compact-beat";

@Injectable({ providedIn: 'root' })
export class JsonFileReader implements JsonFilesReaderInterface {
  constructor(private readonly http: HttpClient) {}

  loadAllJson(): Observable<CompactBeat[]> {
    const files = ['metal-metal.json', 'metal-metal2.json'];

    const requests = files
      .map(file => this.http.get('assets/beats/' + file))
      .map(x => x as Observable<CompactBeat>);

    return forkJoin(requests);
  }
}
