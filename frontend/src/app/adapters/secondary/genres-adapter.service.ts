import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import IManageGenres from "../../domain/ports/secondary/i-manage-genres";
import {Genre} from "../../domain/genre";
import {Effect} from 'effect';
import {lastValueFrom} from "rxjs";
import {Beat} from "../../domain/beat";

@Injectable({providedIn: 'root'})
export class GenresAdapterService implements IManageGenres {

  private beatsUrl = 'api/beats';

  constructor(private http: HttpClient) {
  }

  getGenres(): Promise<Genre[]> {
    const effect = Effect.tryPromise({
      try: async () => {
        const beats = await lastValueFrom(this.http.get<Beat[]>(this.beatsUrl));
        const genres = this.groupBy(beats, (beat) => beat.genre!);
        return Object.keys(genres).map((genre) => ({
          label: genre,
          beats: genres[genre],
        } as Genre));
      },
      catch: (error) => {
        console.error("Error fetching beats:", error);
        throw new Error("Can't get genres");
      }
    });

    return Effect.runPromise(effect);
  }

  private groupBy<T>(array: T[], keyGetter: (item: T) => string): Record<string, T[]> {
    return array.reduce((result, item) => {
      const key = keyGetter(item);
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
      return result;
    }, {} as Record<string, T[]>);
  }
}

