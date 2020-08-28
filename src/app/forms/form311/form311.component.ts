import { Component, OnInit } from '@angular/core';
import {AggregateService} from '../../services/aggregate.service';
import {DataSet, IDataSet} from '../../models/dataSets.model';
import {ActivatedRoute} from '@angular/router';
import {UsefulFunctions} from '../../shared/useful-functions';
import {AreaGroup} from '../../models/areaGroups.model';

@Component({
  selector: 'app-form311',
  templateUrl: './form311.component.html',
  styleUrls: ['./form311.component.css']
})
export class Form311Component implements OnInit {
  orgUnits: any = [{}];
  dataSet: DataSet;
  areaGroup: AreaGroup;
  selectedOrgUnit: string;
  selectedPeriod: string;
  periodObject: any;
  action: any;
  periodList: any[] = [];
  currentYear: number;
  choicePeriod: number;

  constructor(private aggregationService: AggregateService, private route: ActivatedRoute) {
    if (route.snapshot.params.id) {
      this.getOneDataSets(route.snapshot.params.id);
    }
  }

  ngOnInit(): void {
    this.choicePeriod = 0;
    // this.getOrgUnit();
    this.getPeriod();
  }
  getPeriod(){
    this.currentYear = new Date().getFullYear();
    this.periodList = UsefulFunctions.getQuarterlyPeriod(this.currentYear);
    this.selectedPeriod = this.periodList[0].id;
    console.log(this.periodList);
  }
  previewsYearPeriod(){
    this.currentYear -= 1;
    this.periodList = UsefulFunctions.getQuarterlyPeriod(this.currentYear);
  }
  nextYearPeriod(){
    this.currentYear += 1;
    if (this.currentYear > new Date().getFullYear()){
      this.currentYear -= 1;
    }
    this.periodList = UsefulFunctions.getQuarterlyPeriod(this.currentYear);
  }
  selectPeriod(data){
    if (data.target.value){
      this.selectedPeriod = data.target.value;
      this.choicePeriod = 1;
    }
  }
  onPeriodUpdate(periodObject, action){
    this.periodObject = periodObject;
    this.action = action;
  }
  getOrgUnit() {
    const params: string[] = ['fields=id,name,level'];
    this.aggregationService.loadOrgUnits(params).subscribe( (result: any) => {
      this.orgUnits = result.organisationUnits;
      console.log('orgUnit', this.orgUnits);
    });
  }
  getOneDataSets(id: string) {
     this.aggregationService.loadOneDataSet(id).subscribe((dataSets: any) => {
       this.dataSet = dataSets as IDataSet;
       this.selectedOrgUnit = dataSets.organisationUnits[0].id;
       console.log('one Dataset', this.dataSet);
     }, error => {
       console.log(error);
     });
  }
  saveData(data){
    console.log(data);
    this.aggregationService.addData(data.target.id, data.target.value, this.selectedOrgUnit, this.dataSet.id, this.selectedPeriod);
  }

  selectOrgUnit($event) {
    if ($event.target.value){
      this.selectedOrgUnit = $event.target.value;
    }
  }

  completeForm(){
    this.aggregationService.completeRegistration(UsefulFunctions.completeDataSet(this.selectedOrgUnit, this.selectedPeriod, this.dataSet.id))
      .subscribe(response => {
        console.log(response);
      });
  }
}
