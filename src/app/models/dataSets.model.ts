import {IOrgUnit, OrgUnit} from './orgUnit.model';

export interface IDataSet {
  id: string;
  name: string;
  code: string;
  organisationUnits: IOrgUnit[];
}

export class DataSet implements IDataSet{
constructor(
  public id: string,
  public name: string,
  public code: string,
  public organisationUnits: OrgUnit[]) {}
}
