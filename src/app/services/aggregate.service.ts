import { Injectable } from '@angular/core';
import {IDataSet} from '../models/dataSets.model';
import {DataValueSet} from '../models/dataSetValues.model';
import {DataValue} from '../models/dataValues.model';
import {MainService} from './main.service';
import {NgxDhis2HttpClientService} from '@iapps/ngx-dhis2-http-client';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AggregateService extends MainService{

  constructor(private service: NgxDhis2HttpClientService) {
    super(service);
  }

  loadDataSets(params?: string[]) {
    if (params)
      return this.loadMetaData('dataSets', params);
    else
      return this.loadMetaData('dataSets', ['fields=id,name,description,code']);
  }

  loadOneDataSet(dataSetId: string, params?: string[]) {
    if (params)
      return this.loadMetaData(`dataSets/${dataSetId}`, params);
    else
      return this.loadMetaData(`dataSets/${dataSetId}`, ['fields=id,name,description,code']);
  }

  postDataValue(dataValueSet: DataValueSet){
    return this.service.post( 'dataValueSets', dataValueSet);
  }

  save(dataElementId: string, orgUnitId: string, period: string, value: string, categoryOption?: string) {
    if (categoryOption)
      return this.service.post(`dataValues?de=${dataElementId}&pe=${period}&ou=${orgUnitId}&co=${categoryOption}&value=${value}`, null);
    else
      return this.service.post(`dataValues?de=${dataElementId}&pe=${period}&ou=${orgUnitId}&value=${value}`, null);
  }

  remove(dataElementId: string, orgUnitId: string, period: string, categoryOption?: string){
    if (categoryOption)
      return this.service.post(`dataValues?de=${dataElementId}&pe=${period}&ou=${orgUnitId}&co=${categoryOption}`, null);
    else
      return this.service.post(`dataValues?de=${dataElementId}&pe=${period}&ou=${orgUnitId}`, null);
  }

  addData(fieldName, value, idOu, idDs, period) {
    const dataValue = new DataValue(fieldName.split('-')[0], fieldName.split('-')[1], value);
    const dataValues = [];
    dataValues.push(dataValue);
    const dataValuesSet = new DataValueSet(idDs, period, idOu, dataValues);
    console.log('datavaluesSet', dataValuesSet);
    this.postDataValue(dataValuesSet).subscribe(result => {
      console.log(result);
    });
  }

  completeRegistration(data: { completeDataSetRegistrations: any[] }) {
    return this.service.post('completeDataSetRegistrations?skipExistingCheck=true', data);
  }

  loadAvailableDataValues(dataSetId: string) {
    return this.loadMetaData(`dataSets/${dataSetId}/dataValueSet.json`);
  }

  loadOneDataSetValues(url: string) {
    return this.service.get(url);
  }
}
