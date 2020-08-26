import {IOrgUnit, OrgUnit} from './orgUnit.model';

export interface IProgram {
  id: string;
  name: string;
  code: string;
  organisationUnits: IOrgUnit[];
}

export class Program implements IProgram{
  constructor(
    public id: string,
    public name: string,
    public code: string,
    public organisationUnits: OrgUnit[]) {}
}
