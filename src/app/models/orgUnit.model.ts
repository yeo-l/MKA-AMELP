export interface IOrgUnit {
  id: string;
  name: string;
  level: string;
}

export class OrgUnit implements IOrgUnit{
  constructor(
    public id: string,
    public name: string,
    public level: string) {}
}
