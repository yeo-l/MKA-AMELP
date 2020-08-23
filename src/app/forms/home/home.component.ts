import { Component, OnInit } from '@angular/core';
import {AggregationService} from '../../services/aggregation.service';
import {HttpClient} from '@angular/common/http';
import {DataSets, IDataSets} from '../../models/dataSets.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataSets: any[] = [];
  dataSetModel: IDataSets[];

  constructor(private aggregationService: AggregationService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getDataSet();
  }

  getDataSet(){
    this.aggregationService.loadDataSets().subscribe((dataSt: any) => {
      this.dataSets = dataSt.dataSets;
      this.dataSetModel = dataSt.dataSets;
      console.log(this.dataSets);
    });
  }

}
