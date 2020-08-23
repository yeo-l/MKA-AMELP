
import {DataValue, IDataValue} from './dataValues.model';

export interface IDataValueSet {
  dataSet: string;
  period: string;
  orgUnit: string;
  dataValues: IDataValue[];
}

export class DataValueSet implements IDataValueSet{
  constructor(
    public dataSet: string,
    public period: string,
    public orgUnit: string,
    public dataValues: DataValue[]) {}
}
