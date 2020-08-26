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
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxDhis2MenuModule} from '@iapps/ngx-dhis2-menu';
import {NgxDhis2HttpClientModule} from '@iapps/ngx-dhis2-http-client';
import {NgxDhis2PeriodFilterModule} from '@iapps/ngx-dhis2-period-filter';
import { TrackerComponent } from './forms/trackers/tracker.component';

@NgModule({
  declarations: [
    AppComponent,
    Form311Component,
    HomeComponent,
    Form321Component,
    Form322Component,
    Form323Component,
    TrackerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxDhis2MenuModule,
    NgxDhis2PeriodFilterModule,
    NgxDhis2HttpClientModule.forRoot({
      namespace: 'mka-amelp',
      version: 1,
      models: {
        users: 'id',
        dataElements: 'id',
        organisationUnitLevels: 'id',
        organisationUnits: 'id,name,level',
        organisationUnitGroups: 'id',
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
