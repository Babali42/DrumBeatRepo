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

  loadJsonByFileName(filename: string): Effect.Effect<Option.Option<CompactBeat>, never> {
    return Effect.option(
      this.fromObservable(() =>
        this.http.get<CompactBeat>(`/assets/beats/${filename}.json`)
      )
    );
  }

  fromObservable = <A>(obs: () => Observable<A>) =>
    Effect.tryPromise({
      try: () => firstValueFrom(obs()),
      catch: () => new Error()
    });
}
