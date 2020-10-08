import { Injectable } from '@angular/core';
import {MainService} from './main.service';
import {EventModel} from '../models/event.model';
import {NgxDhis2HttpClientService} from '@iapps/ngx-dhis2-http-client';

@Injectable({
  providedIn: 'root'
})
export class TrackerService extends MainService {

  constructor(private service: NgxDhis2HttpClientService) {
    super(service);
  }

  loadPrograms(id: string){
    return this.loadMetaData(`programs/${id}`, ['fields=id,name,code,description,organisationUnits']);
  }

  save(payload: EventModel) {
    return this.service.post('events', payload);
  }

  remove(eventId: string) {
    return this.service.delete(`events/${eventId}`);
  }

  update(eventId: string, payload: EventModel) {
    return this.service.put(`events/${eventId}`, payload);
  }

  loadEvent(id: string) {
    return this.loadMetaData(`events/${id}`, ['fields=']);
  }
}
