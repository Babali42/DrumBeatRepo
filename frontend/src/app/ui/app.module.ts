import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { LoadingBarModule } from '@ngx-loading-bar/core';
import { AppComponent } from './app.component';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { FormsModule } from "@angular/forms";
import { AUDIO_ENGINE } from "../infrastructure/injection-tokens/audio-engine.token";
import { AudioEngineAdapter } from "../infrastructure/adapters/audio-engine/audio-engine.adapter";
import { provideTranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { getBrowserLanguage } from "./i18n/i18n.utils";
import { AUDIO_EXPORT } from "../infrastructure/injection-tokens/audio-export.token";
import { AudioExportAdapter } from "../infrastructure/adapters/audio-export/audio-export.adapter";
import { IMIDI } from "../infrastructure/injection-tokens/i-midi.token";
import { MidiExportService } from "../infrastructure/adapters/midi-export/midi-exporter.service";

@NgModule({
  bootstrap: [AppComponent],
  imports: [BrowserModule,
    LoadingBarModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: AUDIO_ENGINE, useClass: AudioEngineAdapter },
    { provide: AUDIO_EXPORT, useClass: AudioExportAdapter },
    { provide: IMIDI, useClass: MidiExportService },
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

