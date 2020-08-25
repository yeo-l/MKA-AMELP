import { NgModule } from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {Form311Component} from './forms/form311/form311.component';
import {HomeComponent} from './forms/home/home.component';
import {Form321Component} from './forms/form321/form321.component';
import {Form322Component} from './forms/form322/form322.component';
import {Form323Component} from './forms/form323/form323.component';

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
    path: 'form3.1.1/:id',
    component: Form311Component,
    data: {
      title: '3.1.1'
    }
  },
  {
    path: 'form3.2.1/:id',
    component: Form321Component,
    data: {
      title: '3.2.1'
    }
  },
  {
    path: 'form3.2.2/:id',
    component: Form322Component,
    data: {
      title: '3.2.2'
    }
  },
  {
    path: 'form3.2.3/:id',
    component: Form323Component,
    data: {
      title: '3.2.3'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
