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
import {InMemoryBeatGateway} from "../core/adapters/secondary/in-memory-beat-gateway";
import {FormsModule} from "@angular/forms";
import {environment} from "../../environments/environment";
import {BaseUrlInterceptor} from "./interceptors/base-url-interceptor";
import {IManageBeatsToken} from "../core/infrastructure/injection-tokens/i-manage-beat.token";
import {AUDIO_ENGINE} from "../core/infrastructure/injection-tokens/audio-engine.token";
import {AudioEngineAdapter} from "../core/adapters/secondary/audio-engine/audio-engine.adapter";

export const routes: Routes = [
  {path: '', component: SequencerComponent},
  {path: 'add-beat', component: BeatCreatorComponent}
];

RouterModule.forRoot(routes, {
  onSameUrlNavigation: 'reload'
})

export const beatsProvider = {
  provide: IManageBeatsToken,
  useFactory: (inMemoryBeatGateway: InMemoryBeatGateway, beatsAdapterService: InMemoryBeatGateway) => {
    return environment.httpClientInMemory ? inMemoryBeatGateway : beatsAdapterService;
  },
  deps: [InMemoryBeatGateway, InMemoryBeatGateway]
};

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
    { provide: AUDIO_ENGINE, useClass: AudioEngineAdapter },
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptorsFromDi()),
    beatsProvider,
    InMemoryBeatGateway,
    provideZoneChangeDetection()
  ]
})

export class AppModule {
}

