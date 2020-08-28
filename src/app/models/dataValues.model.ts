export interface IDataValue {
  dataElement: string;
  value: string;
  categoryOptionCombo?: string;
}
export class DataValue implements IDataValue {
  constructor(
    public dataElement: string,
    public value: string,
    public categoryOptionCombo?: string) {}
}
