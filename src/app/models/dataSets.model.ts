import {IOrgUnit, OrgUnit} from './orgUnit.model';

export interface IDataSets {
  id: string;
  name: string;
  code: string;
  organisationUnits: IOrgUnit[];
}

export class DataSets implements IDataSets{
constructor(
  public id: string,
  public name: string,
  public code: string,
  public organisationUnits: OrgUnit[]) {}
}
