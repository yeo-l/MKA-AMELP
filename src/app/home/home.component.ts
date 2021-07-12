import { Component, OnInit } from '@angular/core';
import {AggregateService} from '../services/aggregate.service';
import {HttpClient} from '@angular/common/http';
import {DataStore} from '../models/dataStore.model';
import {AreaGroup} from '../models/areaGroups.model';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataSets: any[] = [];
  dataStore: DataStore;
  areaGroups: AreaGroup[];
  type: string;
  loading: boolean;
  content: string;
  selectedProject: string;

  constructor(private aggregationService: AggregateService, private route: ActivatedRoute, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.content = 'Select a project area on the left side to view indicators';
    this.route.params.subscribe(params => {
      this.getAreaDataStore(params['id']);

    });
  }
  getAreaDataStore(id?): void {
    this.aggregationService.getDataStore().subscribe(dataStore => {
      this.dataStore = dataStore;
      if (id) {
      this.getAreaDataSets(id);
      }
    });
  }

  getAreaDataSets(id): void{
    this.dataSets = [];
    this.loading = true;
    for (let i = 0; i < this.dataStore.areaGroups.length; i++){
      if (this.dataStore.areaGroups[i].idOU === id) {
        this.selectedProject = this.dataStore.areaGroups[i].name;
        this.type = this.dataStore.areaGroups[i].type;
        const ids = [];
        // tslint:disable-next-line:prefer-for-of
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
            console.log('data set programs', this.dataSets);
          } else {
            this.dataSets = result.dataSets;
          }
        });
        this.loading = false;
        break;
      }
    }
  }
}
