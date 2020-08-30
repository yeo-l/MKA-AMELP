import { NgModule } from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ConfigurationComponent} from './configuration/configuration.component';
import {TrackerComponent} from './forms/trackers/tracker.component';
import {TrackerFormComponent} from './forms/trackers/tracker-form.component';
import {AggregateComponent} from './forms/aggregates/aggregate.component';
import {AggregateFormComponent} from './forms/aggregates/aggregate-form.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'home page'
    }
  },
  {
    path: 'home',
    component: HomeComponent,
    data: {
      title: 'home page'
    }
  },
  {
    path: 'configuration',
    component: ConfigurationComponent,
    data: {
      title: 'configuration dataStore'
    }
  },
  {
    path: 'tracker/:code/:id',
    component: TrackerComponent,
    data: {
      title: 'Event list'
    }
  },
  {
    path: 'tracker/:code/:id/form',
    component: TrackerFormComponent,
    data: {
      title: 'Form Event'
    }
  },
  {
    path: 'tracker/:code/:id/form/:eventId',
    component: TrackerFormComponent,
    data: {
      title: 'Form Event Edit'
    }
  },
  {
    path: 'aggregate/:code/:id',
    component: AggregateComponent,
    data: {
      title: 'Form Aggregate'
    }
  },
  {
    path: 'aggregate/:code/:id/form',
    component: AggregateFormComponent,
    data: {
      title: 'Form Aggregate Edit'
    }
  },
  {
    path: 'aggregate/:code/:id/form/:period',
    component: AggregateFormComponent,
    data: {
      title: 'Form Aggregate Edit'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
