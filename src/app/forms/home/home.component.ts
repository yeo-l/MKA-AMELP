import { Component, OnInit } from '@angular/core';
import {AggregationService} from '../../services/aggregation.service';
import {HttpClient} from '@angular/common/http';
import {DataStore} from '../../models/dataStore.model';
import {AreaGroup} from '../../models/areaGroups.model';

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

  constructor(private aggregationService: AggregationService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getAreaDataStore();
  }

  // getDataSet(){
  //   this.aggregationService.loadDataSets().subscribe((dataSt: any) => {
  //     this.dataSets = dataSt.dataSets;
  //     this.dataSetModel = dataSt.dataSets;
  //     console.log(this.dataSets);
  //   });
  // }
  getAreaDataStore() {
    this.aggregationService.getDataStore().subscribe(dataStore => {
      this.dataStore = dataStore;
      console.log('dataStore', this.dataStore);
    });
  }
  getAreaDataSets(id){
    this.dataSets = [];
    for (let i = 0; i < this.dataStore.areaGroups.length; i++){
      if (this.dataStore.areaGroups[i].code === id) {
        // this.dataSets = this.dataStore.areaGroups[i].dataSet;
        this.type = this.dataStore.areaGroups[i].type;
        const ids = [];
        for (let j = 0; j < this.dataStore.areaGroups[i].dataSets.length; j++) {
          ids.push(this.dataStore.areaGroups[i].dataSets[j].id);
        }
        let type = 'dataSets';
        if (this.dataStore.areaGroups[i].type === 'tracker'){
          console.log('is tracker');
          type = 'programs';
        }
        const params = ['fields=id,name,code,description', 'filter=id:in:[' + ids.join(',') + ']'];
        this.aggregationService.loadMetaData(`${type}.json`, params).subscribe((result: any) => {
          if (type === 'programs') {
            this.dataSets = result.programs;
          } else {
            this.dataSets = result.dataSets;
          }
          console.log('dataSets', this.dataSets);
        });
        break;
      }
    }
  }
}
