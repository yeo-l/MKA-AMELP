import { Component, OnInit } from '@angular/core';
import {AggregateService} from '../services/aggregate.service';
import {HttpClient} from '@angular/common/http';
import {DataStore} from '../models/dataStore.model';
import {AreaGroup} from '../models/areaGroups.model';

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

  constructor(private aggregationService: AggregateService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getAreaDataStore();
    this.content = 'Select a project area on the left side to view indicators';
  }

  // getDataSet(){
  //   this.aggregationService.loadDataSets().subscribe((dataSt: any) => {
  //     this.dataValueSets = dataSt.dataValueSets;
  //     this.dataSetModel = dataSt.dataValueSets;
  //     console.log(this.dataValueSets);
  //   });
  // }
  getAreaDataStore() {
    this.aggregationService.getDataStore().subscribe(dataStore => {
      this.dataStore = dataStore;
      // console.log('dataStore', this.dataStore);
    });
  }
  getAreaDataSets(id){
    this.dataSets = [];
    this.loading = true;
    for (let i = 0; i < this.dataStore.areaGroups.length; i++){
      if (this.dataStore.areaGroups[i].code === id) {
        this.selectedProject = this.dataStore.areaGroups[i].name;
        // this.dataValueSets = this.dataStore.areaGroups[i].dataSet;
        this.type = this.dataStore.areaGroups[i].type;
        const ids = [];
        for (let j = 0; j < this.dataStore.areaGroups[i].dataSets.length; j++) {
          ids.push(this.dataStore.areaGroups[i].dataSets[j].id);
        }
        let type = 'dataSets';
        if (this.dataStore.areaGroups[i].type === 'tracker'){
          // console.log('is tracker');
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
