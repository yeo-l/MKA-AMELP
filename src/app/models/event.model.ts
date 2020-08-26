import {DataValue} from './dataValues.model';

export interface IEventModel {
  program: string;
  orgUnit: string;
  eventDate: Date;
  status: string;
  dataValues: DataValue[];
}

export class EventModel implements IEventModel{
  constructor(
    public program: string,
    public orgUnit: string,
    public eventDate: Date,
    public status: string,
    public dataValues: DataValue[]) {}
}
