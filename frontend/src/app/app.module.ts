import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
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
import {BaseUrlInterceptor} from "./interceptors/base-url-interceptor";

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule,
    LoadingBarModule,
    FormsModule,
    RouterOutlet
  ],
  providers: [
    {provide: IManageBeatsToken, useClass: BeatsAdapterService},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true},
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptorsFromDi())
  ]
})


export class AppModule {
}

