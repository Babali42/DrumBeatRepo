import {ComponentFixture, TestBed} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {BrowserModule} from "@angular/platform-browser";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {LoadingBarModule} from "@ngx-loading-bar/core";
import {RouterTestingModule} from "@angular/router/testing";
import {routes} from "./app.module";
import {IManageBeatsToken} from "../core/infrastructure/injection-tokens/i-manage-beat.token";
import {InMemoryBeatGateway} from "../core/adapters/secondary/in-memory-beat-gateway";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [AppComponent],
    imports: [BrowserModule, LoadingBarModule, RouterTestingModule.withRoutes(routes)],
    providers: [{ provide: IManageBeatsToken, useClass: InMemoryBeatGateway }, provideHttpClient(withInterceptorsFromDi())]
}).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
