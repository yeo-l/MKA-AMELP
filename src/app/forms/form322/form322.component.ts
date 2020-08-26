import { Component, OnInit } from '@angular/core';
import {AggregationService} from '../../services/aggregation.service';
import {ActivatedRoute} from '@angular/router';
import {DataSets, IDataSets} from '../../models/dataSets.model';
import {AreaGroup} from '../../models/areaGroups.model';
import {UsefulFunctions} from '../../../shared/useful-functions';

@Component({
  selector: 'app-form322',
  templateUrl: './form322.component.html',
  styleUrls: ['./form322.component.css']
})
export class Form322Component implements OnInit {
  periodObject: any;
  action: any;
  periodList: any[] = [];
  currentYear: number;
  choicePeriod: number;
  dataSet: DataSets;
  areaGroup: AreaGroup;
  selectedOrgUnit: string;
  selectedPeriod: string;

  constructor(private aggregationService: AggregationService, private route: ActivatedRoute) {
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
  getOneDataSets(id: number) {
    this.aggregationService.loadDataSets(id).subscribe((dataSets: IDataSets) => {
      this.dataSet = dataSets;
      this.selectedOrgUnit = dataSets.organisationUnits[0].id;
    }, error => {
      console.log(error);
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
