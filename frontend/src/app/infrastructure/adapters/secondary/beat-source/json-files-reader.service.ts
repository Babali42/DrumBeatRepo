import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {JsonFilesReaderInterface} from "./json-files-reader.interface";
import {CompactBeat} from "./compact-beat";

@Injectable({ providedIn: 'root' })
export class JsonFileReader implements JsonFilesReaderInterface {
  constructor(private readonly http: HttpClient) {}

  loadAllJson(): Observable<CompactBeat[]> {
    let files = ['techno/techno.json', 'techno/off-beat-clap.json'];
    files = files.concat('metal/metal.json', 'metal/metal-blastbeat.json', 'metal/half-time-groove.json');
    files = files.concat('rock/rock.json', 'rock/variation.json');
    files = files.concat('punk/punk-beat-quarter-note-groove.json', 'punk/punk-beat-quarter-note-groove-variation.json', 'punk/punk-beat-eight-note-fill.json');
    files = files.concat('psytrance/psytrance.json');
    files = files.concat('dancehall/standard.json');
    files = files.concat('techno-hardcore/gabber.json');
    files = files.concat('dub/dub.json');

    const requests = files
      .map(file => this.http.get('assets/beats/' + file))
      .map(x => x as Observable<CompactBeat>);

    return forkJoin(requests);
  }
}
