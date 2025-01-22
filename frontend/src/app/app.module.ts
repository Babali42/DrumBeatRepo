import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
import {InMemoryDataService} from "./adapters/secondary/in-memory-data.service";
import {SequencerComponent} from "./components/sequencer/sequencer.component";
import {GenresAdapterService} from "./adapters/secondary/genres-adapter.service";
import {LoadingBarModule} from '@ngx-loading-bar/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {LoadingInterceptor} from './interceptors/loading.interceptor';
import {provideRouter, RouterOutlet, Routes} from "@angular/router";
import {BeatCreatorComponent} from "./components/beat-creator/beat-creator.component";
import {FormsModule} from '@angular/forms';

export const routes: Routes = [
  {path: '', component: SequencerComponent},
  {path: 'add-beat', component: BeatCreatorComponent}
];
import {IManageGenresToken} from "./domain/ports/secondary/i-manage-genres";
import {environment} from "../environments/environment";

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule,
    LoadingBarModule,
    FormsModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    environment.httpClientInMemory ? HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, {dataEncapsulation: false}
    ) : [],
    RouterOutlet
  ],
  providers: [
    {provide: IManageGenresToken, useClass: GenresAdapterService},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: IManageGenresToken, useClass: GenresAdapterService },
    //@ts-ignore
    environment.httpClientInMemory ? HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
      dataEncapsulation: false
    }).providers : []
  ]
})


export class AppModule {
}

