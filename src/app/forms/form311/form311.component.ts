import { Component, OnInit } from '@angular/core';
import {AggregationService} from '../../services/aggregation.service';
import {DataSets, IDataSets} from '../../models/dataSets.model';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-form311',
  templateUrl: './form311.component.html',
  styleUrls: ['./form311.component.css']
})
export class Form311Component implements OnInit {
  orgUnits: any = [{}];
  dataSet: DataSets;
  selectedOrgUnit: string;
  selectedPeriod: string;
  periodFilterConfig: any = {
    singleSelection: true,
    emitOnSelection: true,
    childrenPeriodSortOrder: 'ASC',
    allowDateRangeSelection: false,
    allowRelativePeriodSelection: false,
    allowFixedPeriodSelection: true
  };
  periodObject: any;
  action: any;

  constructor(private aggregationService: AggregationService, private route: ActivatedRoute) {
    if (route.snapshot.params.id) {
      this.getOneDataSets(route.snapshot.params.id);
    }
  }

  ngOnInit(): void {
    this.getOrgUnit();
  }
  onPeriodUpdate(periodObject, action){
    this.periodObject = periodObject;
    this.action = action;
    console.log(this.periodObject);
  }
  getOrgUnit() {
    const params: string[] = ['fields=id,name,level'];
    this.aggregationService.loadOrganisationUnits(params).subscribe( (result: any) => {
      this.orgUnits = result.organisationUnits;
    });
    console.log(this.orgUnits);
  }
  getOneDataSets(id: number) {
     this.aggregationService.getDataSetId(id).subscribe((dataSets: IDataSets) => {
       this.dataSet = dataSets;
     }, error => {
       console.log(error);
     });
  }
  saveData(data){
    this.aggregationService.addData(data.id, data.value, this.selectedOrgUnit, this.dataSet.id, this.selectedPeriod);
    console.log(data);
  }

  selectOrgUnit($event) {
    if ($event.value){
      this.selectedOrgUnit = $event.value;
    }
  }
}
