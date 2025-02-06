import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
import {InMemoryDataService} from "./adapters/secondary/in-memory-data.service";
import {SequencerComponent} from "./components/sequencer/sequencer.component";
import {BeatsAdapterService} from "./adapters/secondary/beats-adapter.service";
import {LoadingBarModule} from '@ngx-loading-bar/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {LoadingInterceptor} from './interceptors/loading.interceptor';
import {provideRouter, RouterOutlet, Routes, withHashLocation} from "@angular/router";
import {BeatCreatorComponent} from "./components/beat-creator/beat-creator.component";
import {FormsModule} from '@angular/forms';

export const routes: Routes = [
  {path: '', component: SequencerComponent},
  {path: 'add-beat', component: BeatCreatorComponent}
];
import {IManageBeatsToken} from "./domain/ports/secondary/i-manage-beats";
import {environment} from "../environments/environment";

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule,
    LoadingBarModule,
    FormsModule,
    environment.httpClientInMemory ? HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, {dataEncapsulation: false}
    ) : [],
    RouterOutlet
  ],
  providers: [
    {provide: IManageBeatsToken, useClass: BeatsAdapterService},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: IManageBeatsToken, useClass: BeatsAdapterService },
    //@ts-ignore
    environment.httpClientInMemory ? HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
      dataEncapsulation: false
    }).providers : []
  ]
})


export class AppModule {
}

