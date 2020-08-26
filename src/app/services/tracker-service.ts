import { Injectable } from '@angular/core';
import {MainService} from './main-service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TrackerService extends MainService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  loadPrograms(id: string){
    return this.loadMetaData(`programs/${id}`, ['fields=id,name,code,description']);
  }

}
