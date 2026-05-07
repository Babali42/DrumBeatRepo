import {NgModule, provideZoneChangeDetection} from '@angular/core';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideRouter, RouterModule, RouterOutlet, Routes, withHashLocation} from "@angular/router";
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';

import {LoadingBarModule} from '@ngx-loading-bar/core';
import {AppComponent} from './app.component';
import {SequencerComponent} from "./components/sequencer/sequencer.component";
import {LoadingInterceptor} from './interceptors/loading.interceptor';
import {BeatAdapter} from "../infrastructure/adapters/beat-source/beat-adapter.service";
import {FormsModule} from "@angular/forms";
import {AUDIO_ENGINE} from "../infrastructure/injection-tokens/audio-engine.token";
import {AudioEngineAdapter} from "../infrastructure/adapters/audio-engine/audio-engine.adapter";
import {JsonFileReader} from "../infrastructure/adapters/beat-source/json-files-reader.service";
import {IManageBeatsToken} from "../infrastructure/injection-tokens/i-manage-beat.token";
import {jsonFileReaderToken} from "../infrastructure/injection-tokens/json-file-reader.token";
import {provideTranslateService, TranslateModule} from "@ngx-translate/core";
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";
import {getBrowserLanguage} from "./i18n/i18n.utils";
import {AUDIO_EXPORT} from "../infrastructure/injection-tokens/audio-export.token";
import {AudioExportAdapter} from "../infrastructure/adapters/audio-export/audio-export.adapter";
import {IMIDI} from "../infrastructure/injection-tokens/i-midi.token";
import {MidiExportService} from "../infrastructure/adapters/midi-export/midi-exporter.service";

export const routes: Routes = [
  {path: '', component: SequencerComponent}
];

RouterModule.forRoot(routes, {
  onSameUrlNavigation: 'reload'
})

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule,
    LoadingBarModule,
    FormsModule,
    RouterOutlet,
    TranslateModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    {provide: jsonFileReaderToken, useClass: JsonFileReader},
    {provide: AUDIO_ENGINE, useClass: AudioEngineAdapter},
    {provide: AUDIO_EXPORT, useClass: AudioExportAdapter},
    {provide: IManageBeatsToken, useClass: BeatAdapter},
    {provide: IMIDI, useClass: MidiExportService},
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection(),
    provideTranslateService({
      lang: getBrowserLanguage(),
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json'
      })
    })
  ]
})

export class AppModule {
}

