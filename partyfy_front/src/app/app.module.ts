import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { SearchresultsComponent } from './searchresults/searchresults.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { SigninComponent } from './signin/signin.component';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    SearchresultsComponent,
    SigninComponent
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
