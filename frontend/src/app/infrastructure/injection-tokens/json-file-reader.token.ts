import {InjectionToken} from "@angular/core";
import {JsonFilesReaderInterface} from "../adapters/beat-source/json-files-reader.interface";

export const jsonFileReaderToken = new InjectionToken<JsonFilesReaderInterface>('JsonFilesReaderInterface');
