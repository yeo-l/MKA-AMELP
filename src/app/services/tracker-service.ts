import { Injectable } from '@angular/core';
import {MainService} from './main-service';
import {HttpClient} from '@angular/common/http';
import {EventModel} from '../models/event.model';
import {NgxDhis2HttpClientService} from '@iapps/ngx-dhis2-http-client';

@Injectable({
  providedIn: 'root'
})
export class TrackerService extends MainService {

  constructor(httpClient: HttpClient, private service: NgxDhis2HttpClientService) {
    super(httpClient);
  }

  loadPrograms(id: string){
    return this.loadMetaData(`programs/${id}`, ['fields=id,name,code,description,organisationUnits']);
  }

  postEvent(payload: EventModel) {
    return this.service.post('events', payload);
  }

}
