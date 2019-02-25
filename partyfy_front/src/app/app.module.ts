import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { SearchresultsComponent } from './searchresults/searchresults.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { SigninComponent } from './signin/signin.component';
import { AppRoutingModule } from './app-routing.module';
import { SigninStartFormComponent } from './signin-start-form/signin-start-form.component';
import { SigninDeviceFormComponent } from './signin-device-form/signin-device-form.component';
import { SigninPlaylistFormComponent } from './signin-playlist-form/signin-playlist-form.component';
import { SigninFinalFormComponent } from './signin-final-form/signin-final-form.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    SearchresultsComponent,
    SigninComponent,
    SigninStartFormComponent,
    SigninDeviceFormComponent,
    SigninPlaylistFormComponent,
    SigninFinalFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ScrollToModule.forRoot(),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
