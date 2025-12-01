import {NgModule, provideZoneChangeDetection} from '@angular/core';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideRouter, RouterModule, RouterOutlet, Routes, withHashLocation} from "@angular/router";
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';

import {LoadingBarModule} from '@ngx-loading-bar/core';
import {AppComponent} from './app.component';
import {SequencerComponent} from "./components/sequencer/sequencer.component";
import {LoadingInterceptor} from './interceptors/loading.interceptor';
import {BeatCreatorComponent} from "./components/beat-creator/beat-creator.component";
import {BeatAdapter} from "../infrastructure/adapters/secondary/beat-source/beat-adapter.service";
import {FormsModule} from "@angular/forms";
import {BaseUrlInterceptor} from "./interceptors/base-url-interceptor";
import {AUDIO_ENGINE} from "../infrastructure/injection-tokens/audio-engine.token";
import {AudioEngineAdapter} from "../infrastructure/adapters/secondary/audio-engine/audio-engine.adapter";
import {JSON_TOKEN} from "../infrastructure/adapters/secondary/beat-source/jsonFileReaderInterface";
import {JsonFileReader} from "../infrastructure/adapters/secondary/beat-source/json-files-reader.service";
import {IManageBeatsToken} from "../infrastructure/injection-tokens/i-manage-beat.token";

export const routes: Routes = [
  {path: '', component: SequencerComponent},
  {path: 'add-beat', component: BeatCreatorComponent}
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
    RouterOutlet
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true},
    {provide: JSON_TOKEN, useClass: JsonFileReader},
    {provide: AUDIO_ENGINE, useClass: AudioEngineAdapter},
    {provide: IManageBeatsToken, useClass: BeatAdapter},
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection()
  ]
})

export class AppModule {
}

