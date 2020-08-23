export interface IDataSets {
  id: string;
  name: string;
  code: string;
}

export class DataSets implements IDataSets{
constructor(
  public id: string,
  public name: string,
  public code: string) {}
}
