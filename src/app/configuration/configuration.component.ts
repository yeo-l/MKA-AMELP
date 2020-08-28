import { Component, OnInit } from '@angular/core';
import {AggregateService} from '../services/aggregate.service';
import {DataStore} from '../models/dataStore.model';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {
  dataStore: DataStore;

  constructor(private aggregationService: AggregateService) { }

  ngOnInit(): void {
    this.getAreaDataStore();
  }
  async getAreaDataStore(): Promise<void> {
    await this.aggregationService.getDataStore().subscribe(dataStore => {
      this.dataStore = dataStore;
      console.log('dataStore', this.dataStore);
      // this.aggregationService.getDataSetId(dataStore.dataSet.id);
    });
  }

}
