import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { JsonFilesReaderInterface } from "./json-files-reader.interface";
import { CompactBeat } from "./compact-beat";
import { Effect, Option } from "effect";

@Injectable({ providedIn: 'root' })
export class JsonFileReader implements JsonFilesReaderInterface {
  constructor(private readonly http: HttpClient) {
  }

  loadAllJson(): Effect.Effect<Option.Option<CompactBeat>[], never> {
    const files = ['dnb/dnb']
      .concat('hypnotic-techno/tresillo', 'hypnotic-techno/son-clave')
      .concat('techno/techno', 'techno/off-beat-clap')
      .concat('hardcore-techno/gabber')
      .concat('psytrance/psytrance')
      .concat('dub/dub')
      .concat('dancehall/reggaeton', 'dancehall/standard', 'dancehall/modern')
      .concat('hip-hop/trap', 'hip-hop/jul')
      .concat('metal/metal', 'metal/metal-blastbeat', 'metal/half-time-groove')
      .concat('rock/rock', 'rock/variation')
      .concat('punk/punk-beat-quarter-note-groove', 'punk/punk-beat-quarter-note-groove-variation', 'punk/punk-beat-eight-note-fill')
      .concat('ebm/ebm')
    return this.loadAllBeats(files);
  }

  loadAllBeats = (files: readonly string[]) =>
    Effect.all(
      files.map(file =>
        Effect.option(
          this.fromObservable(() =>
            this.http.get<CompactBeat>(`/assets/beats/${file}.json`)
          )
        )
      )
    );

  fromObservable = <A>(obs: () => Observable<A>) =>
    Effect.tryPromise({
      try: () => firstValueFrom(obs()),
      catch: () => new Error()
    });
}
