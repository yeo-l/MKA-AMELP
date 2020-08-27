export interface IDataValue {
  dataElement: string;
  categoryOptionCombo: string;
  value: string;
}
export class DataValue implements IDataValue {
  constructor(
    public dataElement: string,
    public categoryOptionCombo: string,
    public value: string) {}
}
