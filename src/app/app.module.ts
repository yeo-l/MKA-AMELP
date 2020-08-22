import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Form311Component } from './forms/form311/form311.component';
import { HomeComponent } from './forms/home/home.component';
import {FormsModule} from '@angular/forms';
import { Form321Component } from './forms/form321/form321.component';
import { Form322Component } from './forms/form322/form322.component';
import { Form323Component } from './forms/form323/form323.component';

@NgModule({
  declarations: [
    AppComponent,
    Form311Component,
    HomeComponent,
    Form321Component,
    Form322Component,
    Form323Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
