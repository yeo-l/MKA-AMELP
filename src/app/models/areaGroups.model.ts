import {DataSet, IDataSet} from './dataSets.model';

export interface IAreaGroup {
  code?: string;
  idOU?: string
  type?: string
  name?: string;
  dataSets?: IDataSet[];
}
export class AreaGroup implements IAreaGroup{
  constructor(public code?: string,
              public idOU?: string,
              public type?: string,
              public name?: string,
              public dataSets?: DataSet[]) {}
}
