import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {NgxDhis2HttpClientService} from '@iapps/ngx-dhis2-http-client';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private httpClient: NgxDhis2HttpClientService) { }

  loadMetaData(metaData: string, params?: string[]): Observable<any>{
    return this.httpClient.get(metaData + '?paging=false' + (params ? '&' + params.join('&') : ''));
  }
  // loadDataElements(params?: string[]): Observable<Object> {
  //   if (params)
  //     return this.loadMetaData('dataElements', params);
  //   else
  //     return this.loadMetaData('dataElements', ['fields=id,name,description,code']);
  // }
  //
  // loadOneDataElement(dataElementId: string, params?: string[]) {
  //   if (params)
  //     return this.loadMetaData(`dataElements/${dataElementId}`, params);
  //   else
  //     return this.loadMetaData(`dataElements/${dataElementId}`, ['fields=id,name,description,code']);
  // }
  loadOrgUnits(params?: string[]) {
    if (params)
      return this.loadMetaData('organisationUnits', params);
    else
      return this.loadMetaData('organisationUnits', ['fields=id,name,code']);
  }
  loadOneOrgUnit(orgUnitId: string, params?: string[]) {
    if (params)
      return this.loadMetaData(`organisationUnits/${orgUnitId}`, params);
    else
      return this.loadMetaData(`organisationUnits/${orgUnitId}`, ['fields=id,name,code']);
  }
  getDataStore(){
    return this.httpClient.get('dataStore/projectAreaDataStore/area');
  }
  alertSave(title: string){
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    Toast.fire({
      icon: 'success',
      title: title
    });
  }
}
