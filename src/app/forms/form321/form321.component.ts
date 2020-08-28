import { Component, OnInit } from '@angular/core';
import {AggregateService} from '../../services/aggregate.service';
import {ActivatedRoute} from '@angular/router';
import {UsefulFunctions} from '../../shared/useful-functions';
import {DataSet, IDataSet} from '../../models/dataSets.model';
import {AreaGroup} from '../../models/areaGroups.model';

@Component({
  selector: 'app-form321',
  templateUrl: './form321.component.html',
  styleUrls: ['./form321.component.css']
})
export class Form321Component implements OnInit {
  periodObject: any;
  action: any;
  periodList: any[] = [];
  currentYear: number;
  choicePeriod: number;
  dataSet: DataSet;
  areaGroup: AreaGroup;
  selectedOrgUnit: string;
  selectedPeriod: string;

  constructor(private aggregationService: AggregateService, private route: ActivatedRoute) {
    if (route.snapshot.params.id) {
      this.getOneDataSets(route.snapshot.params.id);
    }
  }

  ngOnInit(): void {
    this.choicePeriod = 0;
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
  getOneDataSets(id: string) {
    this.aggregationService.loadOneDataSet(id).subscribe((dataSets: any) => {
      this.dataSet = dataSets as IDataSet;
      this.selectedOrgUnit = dataSets.organisationUnits[0].id;
    }, error => {
      // console.log(error);
    });
  }
  saveData(data){
    console.log(data);
    this.aggregationService.addData(data.target.id, data.target.value, this.selectedOrgUnit, this.dataSet.id, this.selectedPeriod);
  }
  completeForm(){
    this.aggregationService.completeRegistration(UsefulFunctions.completeDataSet(this.selectedOrgUnit, this.selectedPeriod, this.dataSet.id))
      .subscribe(response => {
        console.log(response);
      });
  }

}
