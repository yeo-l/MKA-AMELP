import { Component, OnInit } from '@angular/core';
import {AggregateService} from '../services/aggregate.service';
import {HttpClient} from '@angular/common/http';
import {DataStore} from '../models/dataStore.model';
import {AreaGroup} from '../models/areaGroups.model';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataSets: any[] = [];
  // dataSetModel: ;
  dataStore: DataStore;
  areaGroups: AreaGroup[];
  type: string;
  loading: boolean;
  content: string;
  selectedProject: string;
  organisationUnits: any[] = [];

  constructor(private aggregationService: AggregateService, private route: ActivatedRoute, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getAreaOrgUnit();
    this.content = 'Select a project area on the left side to view indicators';
    this.route.params.subscribe(params => {
      this.getAreaDataStore(params['id']);
      // if (params['id']){
      //   console.log(params['id']);
      //   this.getAreaDataSets(params['id']);
      // }

    });
  }

  // getDataSet(){
  //   this.aggregationService.loadDataSets().subscribe((dataSt: any) => {
  //     this.dataValueSets = dataSt.dataValueSets;
  //     this.dataSetModel = dataSt.dataValueSets;
  //     console.log(this.dataValueSets);
  //   });
  // }
  getAreaDataStore(id?) {
    this.aggregationService.getDataStore().subscribe(dataStore => {
      this.dataStore = dataStore;
      if (id)
      this.getAreaDataSets(id);
    });
  }
  getAreaOrgUnit(){
    const params: string[] = ['fields=id,name&userDataViewOnly=true&filter=level:eq:' + 3];
    this.aggregationService.loadOrgUnits(params).subscribe((data: any) =>{
      this.organisationUnits = data.organisationUnits;
      console.log(this.organisationUnits)
    })
  }
  getAreaDataSets(id){
    this.dataSets = [];
    this.loading = true;
    for (let i = 0; i < this.dataStore.areaGroups.length; i++){
      if (this.dataStore.areaGroups[i].idOU === id) {
        this.selectedProject = this.dataStore.areaGroups[i].name;
        // this.dataValueSets = this.dataStore.areaGroups[i].dataSet;
        this.type = this.dataStore.areaGroups[i].type;
        const ids = [];
        for (let j = 0; j < this.dataStore.areaGroups[i].dataSets.length; j++) {
          ids.push(this.dataStore.areaGroups[i].dataSets[j].id);
        }
        let type = 'dataSets';
        if (this.dataStore.areaGroups[i].type === 'tracker'){
          type = 'programs';
        }
        const params = ['fields=id,name,code,description', 'filter=id:in:[' + ids.join(',') + ']'];
        this.aggregationService.loadMetaData(`${type}.json`, params).subscribe((result: any) => {
          if (type === 'programs') {
            this.dataSets = result.programs;
          } else {
            this.dataSets = result.dataSets;
          }
          // console.log('dataValueSets', this.dataValueSets);
        });
        this.loading = false;
        break;
      }
    }
  }
}
