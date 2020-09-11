import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxDhis2MenuModule} from '@iapps/ngx-dhis2-menu';
import {NgxDhis2HttpClientModule} from '@iapps/ngx-dhis2-http-client';
import { TrackerComponent } from './forms/trackers/tracker.component';
import { TrackerFormComponent } from './forms/trackers/tracker-form.component';
import { AggregateFormComponent } from './forms/aggregates/aggregate-form.component';
import { AggregateComponent } from './forms/aggregates/aggregate.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TrackerComponent,
    TrackerFormComponent,
    AggregateFormComponent,
    AggregateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxDhis2MenuModule,
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
