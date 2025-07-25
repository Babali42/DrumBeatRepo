import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import IManageBeats from "../../domain/ports/secondary/i-manage-beats";
import {BeatsGroupedByGenre} from "../../domain/beatsGroupedByGenre";
import {Effect} from 'effect';
import {lastValueFrom} from "rxjs";
import {CompactBeat} from "../../domain/compact-beat";

@Injectable({providedIn: 'root'})
export class BeatsAdapterService implements IManageBeats {

  private readonly beatsUrl = 'beats/';

  constructor(private readonly http: HttpClient) {

  }

  getBeatsGroupedByGenres = (): Promise<readonly BeatsGroupedByGenre[]> => {
    const effect = Effect.tryPromise({
      try: async () => {
        const beats = await lastValueFrom(this.http.get<CompactBeat[]>(this.beatsUrl));
        const beatsGroupedByGenres = this.groupBy(beats, (beat) => beat.genre);
        return Object.keys(beatsGroupedByGenres).map((genre) => ({
          label: genre,
          beats: beatsGroupedByGenres[genre],
        } as BeatsGroupedByGenre));
      },
      catch: (error) => {
        console.error("Error fetching beats:", error);
        throw new Error("Can't get beats grouped by genre");
      }
    });

    return Effect.runPromise(effect);
  };


  private groupBy<T>(array: readonly T[], keyGetter: (item: T) => string): Record<string, T[]> {
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

