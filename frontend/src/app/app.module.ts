import {NgModule} from '@angular/core';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideRouter, RouterOutlet, Routes, withHashLocation} from "@angular/router";
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';

import {LoadingBarModule} from '@ngx-loading-bar/core';
import {AppComponent} from './app.component';
import {SequencerComponent} from "./components/sequencer/sequencer.component";
import {LoadingInterceptor} from './interceptors/loading.interceptor';
import {BeatCreatorComponent} from "./components/beat-creator/beat-creator.component";
import {IManageBeatsToken} from "./domain/ports/secondary/i-manage-beats";
import {BeatsAdapterService} from "./adapters/secondary/beats-adapter.service";
import {InMemoryBeatGateway} from "./adapters/secondary/in-memory-beat-gateway";
import {FormsModule} from "@angular/forms";
import {environment} from "../environments/environment";

export const routes: Routes = [
  {path: '', component: SequencerComponent},
  {path: 'add-beat', component: BeatCreatorComponent}
];

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
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptorsFromDi()),
    beatsProvider,
    BeatsAdapterService,
    InMemoryBeatGateway
  ]
})

export class AppModule {
}

