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
    for (let i = 0; i < this.dataStore.areaGroups.length; i++){
      if (this.dataStore.areaGroups[i].code === id){
        // this.dataSets = this.dataStore.areaGroups[i].dataSet;
        const ids = [];
        for (let j = 0; j < this.dataStore.areaGroups[i].dataSets.length; j++){
          ids.push(this.dataStore.areaGroups[i].dataSets[j].id);
        }
        const params = ['fields=id,name,code', 'filter=id:in:[' + ids.join(',') + ']'];
        this.aggregationService.loadMetaData('dataSets.json', params).subscribe((result: any) => {
          this.dataSets = result.dataSets;
          console.log('dataSets', this.dataSets);
        });
        break;
      }
    }
  }
}
