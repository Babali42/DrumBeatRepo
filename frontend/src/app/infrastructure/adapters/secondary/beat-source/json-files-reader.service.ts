import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {firstValueFrom, from, Observable} from 'rxjs';
import {JsonFilesReaderInterface} from "./json-files-reader.interface";
import {CompactBeat} from "./compact-beat";
import {Effect} from "effect";

@Injectable({ providedIn: 'root' })
export class JsonFileReader implements JsonFilesReaderInterface {
  constructor(private readonly http: HttpClient) {
  }

  loadAllJson(): Observable<readonly (CompactBeat | null)[]> {
    let files = ['techno/techno.json', 'techno/off-beat-clap.json', 'techno/tresillo.json'];
    files = files.concat('metal/metal.json', 'metal/metal-blastbeat.json', 'metal/half-time-groove.json');
    files = files.concat('rock/rock.json', 'rock/variation.json');
    files = files.concat('punk/punk-beat-quarter-note-groove.json', 'punk/punk-beat-quarter-note-groove-variation.json', 'punk/punk-beat-eight-note-fill.json');
    files = files.concat('psytrance/psytrance.json');
    files = files.concat('dancehall/standard.json');
    files = files.concat('techno-hardcore/gabber.json');
    files = files.concat('dub/dub.json');

    return from(Effect.runPromise(this.loadAllBeats(files)));
  }

  loadAllBeats = (files: readonly string[]) =>
    Effect.all(
      files.map(file => this.fromObservable(() => this.http.get<CompactBeat>(`/assets/beats/${file}`)).pipe(
        Effect.catchAll(() => Effect.succeed(null))
      )),
      { discard: false }
    );

  fromObservable = <A>(obs: () => Observable<A>): Effect.Effect<A, HttpErrorResponse> =>
    Effect.tryPromise({
      try: () => firstValueFrom(obs()),
      catch: (err) => err as HttpErrorResponse
    });
}
