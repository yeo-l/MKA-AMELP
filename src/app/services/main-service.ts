import { Injectable } from '@angular/core';
import {SERVER_API_URL} from '../../shared/constants';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  resourceUrl = SERVER_API_URL + '/';

  constructor(private httpClient: HttpClient) { }

  loadMetaData(metaData: string, params: string[] | undefined | null): Observable<object[]>{
    return this.httpClient.get<object[]>(SERVER_API_URL + '/' + metaData + '?paging=false' + (params ? '&' + params.join('&') : ''));
  }

  loadDataElements(params: string[] | undefined | null) {
    if (params)
      return this.loadMetaData('dataElements', ['fields=id,name,description,code']);
    else
      return this.loadMetaData('dataElements', params);
  }

  loadDataSets(params: string[] | undefined | null) {
    if (params)
      return this.loadMetaData('dataSets', ['fields=id,name,description,code']);
    else
      return this.loadMetaData('dataSets', params);
  }

  loadOrgUnits(params: string[] | undefined | null) {
    if (params)
      return this.loadMetaData('organisationUnits', ['fields=id,name,code']);
    else
      return this.loadMetaData('organisationUnits', params);
  }
}
