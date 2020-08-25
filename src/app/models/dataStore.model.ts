
import {AreaGroup, IAreaGroup} from './areaGroups.model';

export interface IDataStore {
  areaGroups: IAreaGroup[];
}
export class DataStore implements IDataStore{
  constructor(public areaGroups: AreaGroup[]) {}
}
