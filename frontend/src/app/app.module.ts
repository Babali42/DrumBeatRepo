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
import {BeatsAdapterService} from "./adapters/secondary/beats-adapter.service";
import {InMemoryBeatGateway} from "./adapters/secondary/in-memory-beat-gateway";
import {FormsModule} from "@angular/forms";
import {environment} from "../environments/environment";
import {BaseUrlInterceptor} from "./interceptors/base-url-interceptor";
import {IManageBeatsToken} from "./infrastructure/injection-tokens/i-manage-beat.token";
import {AUDIO_ENGINE} from "./infrastructure/injection-tokens/audio-engine.token";
import {SoundService} from "./adapters/secondary/sound/sound.service";

export const routes: Routes = [
  {path: '', component: SequencerComponent},
  {path: 'add-beat', component: BeatCreatorComponent}
];

RouterModule.forRoot(routes, {
  onSameUrlNavigation: 'reload'
})

export const beatsProvider = {
  provide: IManageBeatsToken,
  useFactory: (inMemoryBeatGateway: InMemoryBeatGateway, beatsAdapterService: BeatsAdapterService) => {
    return environment.httpClientInMemory ? inMemoryBeatGateway : beatsAdapterService;
  },
  deps: [InMemoryBeatGateway, BeatsAdapterService]
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
    { provide: AUDIO_ENGINE, useClass: SoundService },
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptorsFromDi()),
    beatsProvider,
    BeatsAdapterService,
    InMemoryBeatGateway,
    provideZoneChangeDetection()
  ]
})

export class AppModule {
}

