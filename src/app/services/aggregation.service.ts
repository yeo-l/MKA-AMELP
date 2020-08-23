import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SERVER_API_URL} from '../../shared/constants';
import {Observable} from 'rxjs';
import {IDataSets} from '../models/dataSets.model';
import {DataValueSet} from '../models/dataSetValues.model';
import {DataValue} from '../models/dataValues.model';

@Injectable({
  providedIn: 'root'
})
export class AggregationService {
  resourceUrl = SERVER_API_URL + '/dataSets';

  constructor(private httpClient: HttpClient) { }
  loadDataSets(){
    return this.httpClient.get(SERVER_API_URL + '/dataSets?fields=id,name,code&paging=false');
  }
  loadMetaData(metaData: string, params: string[]){
    return this.httpClient.get<[]>(SERVER_API_URL + '/' + metaData + '?paging=false' + (params ? '&' + params.join('&') : ''));
  }
  loadOrganisationUnits(params) {
    return this.loadMetaData('organisationUnits', params);
  }
  getDataSetId(id) {
    return this.httpClient.get<IDataSets>(this.resourceUrl + '/' + id);
  }
  postDataValue(dataValueSet: DataValueSet){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    };
    return this.httpClient.post(SERVER_API_URL + 'dataValuesSet', dataValueSet, httpOptions);
  }
  addData(fieldName, value, idOu, idDs, period) {
    const dataValue = new DataValue(fieldName.split('-')[0], fieldName.split('-')[1], value);
    const dataValues = [];
    dataValues.push(dataValue);
    const dataValuesSet = new DataValueSet(idDs, period, idOu, dataValues);
    this.postDataValue(dataValuesSet).subscribe(result => {
      console.log(result);
    });
  }
  validateData(){}
}
