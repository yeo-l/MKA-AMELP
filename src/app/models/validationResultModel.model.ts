

export interface IValidationResult {
  importance: string;
  leftSideValue: number;
  operator: string;
  organisationUnitDisplayName: string;
  periodDisplayName: string;
  rightSideValue: number;
  validationRuleDescription: string;
}
export class ValidationResult implements IValidationResult{
  constructor(public importance: string,
              public leftSideValue: number,
              public operator: string,
              public organisationUnitDisplayName: string,
              public periodDisplayName: string,
              public rightSideValue: number,
              public validationRuleDescription: string,
              ){}
}
