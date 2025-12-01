import {Observable} from "rxjs";

export interface JsonFileReaderInterface {
  loadAllJson(): Observable<any[]>
}

import { InjectionToken } from '@angular/core';

export const JSON_TOKEN = new InjectionToken<JsonFileReaderInterface>('JsonFileReaderInterface');
