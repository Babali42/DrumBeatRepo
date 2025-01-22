import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import IManageGenres from "../../domain/ports/secondary/i-manage-genres";
import {Genre} from "../../domain/genre";
import {Effect} from 'effect';
import {lastValueFrom} from "rxjs";

@Injectable({providedIn: 'root'})
export class GenresAdapterService implements IManageGenres {

  private genresUrl = 'api/genres';

  constructor(private http: HttpClient) {
  }

  getGenres(): Promise<Genre[]> {
    const effect = Effect.tryPromise({
      try: () => lastValueFrom(this.http.get<Genre[]>(this.genresUrl)),
      catch: () => new Error("Can't get genres")
    });

    return Effect.runPromise(effect);
  }
}
