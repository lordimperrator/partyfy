import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  { path: 'signin', component: SigninComponent},
  { path: '', component: SearchComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports:  [RouterModule]
})
export class AppRoutingModule { }
