import {ComponentFixture, TestBed} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {IManageGenresToken} from "./domain/ports/secondary/i-manage-genres";
import {GenresAdapterService} from "./adapters/secondary/genres-adapter.service";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {LoadingBarModule} from "@ngx-loading-bar/core";
import {RouterTestingModule} from "@angular/router/testing";
import {routes} from "./app.module";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent], // Declare the component
      imports: [BrowserModule, HttpClientModule, LoadingBarModule, RouterTestingModule.withRoutes(routes)],
      providers: [{ provide: IManageGenresToken, useClass: GenresAdapterService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});