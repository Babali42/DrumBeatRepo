import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JsonFileReader {
  constructor(private http: HttpClient) {}

  loadAllJson(): Observable<any[]> {
    const files = ['metal-metal.json'];

    const requests = files.map(file =>
      this.http.get('assets/beats/' + file)
    );

    return forkJoin(requests);
  }
}
