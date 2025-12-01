import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import {switchMap} from "rxjs/operators";
import {CompactBeat} from "./compact-beat";

@Injectable({ providedIn: 'root' })
export class JsonLoaderService {
  constructor(private http: HttpClient) {}

  loadAllJson(): Observable<any[]> {
    const basePath = 'assets/beats/';
    const files = ['metal-metal.json'];

    const requests = files.map(file =>
      this.http.get(basePath + file)
    );

    var objects = forkJoin(requests).pipe(
      switchMap(response => response.map(x => JSON.parse(x) as CompactBeat)),
    ).subscribe(json => {});
  }
}
