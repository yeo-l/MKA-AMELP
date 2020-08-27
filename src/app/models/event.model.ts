import {DataValue} from './dataValues.model';

export interface IEventModel {
  program?: string;
  orgUnit?: string;
  eventDate?: string;
  status?: string;
  dataValues?: DataValue[];
}

export class EventModel implements IEventModel{
  constructor(
    public program: string,
    public orgUnit: string,
    public eventDate?: string,
    public status?: string,
    public dataValues?: DataValue[]) {}
}
