import { Component, OnInit } from '@angular/core';
import {DataSet, IDataSet} from '../../models/dataSets.model';
import {ActivatedRoute} from '@angular/router';
import {AggregateService} from '../../services/aggregate.service';
import {UsefulFunctions} from '../../shared/useful-functions';

@Component({
  selector: 'app-aggregate',
  templateUrl: './aggregate.component.html',
  styleUrls: ['./aggregate.component.css']
})
export class AggregateComponent implements OnInit {

  private sub: any;
  dataValueSets: any;
  currentDataSet: IDataSet;
  dataSetCode: string;

  constructor(private service: AggregateService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.dataSetCode = params['code'];
      this.service.loadOneDataSet(params['id'], ['fields=id,name,description,code,organisationUnits[id,name]']).subscribe((result: any) => {
        this.currentDataSet = result as DataSet;
        this.getDataValueSets(this.currentDataSet.id, this.currentDataSet.organisationUnits[0].id);
      });
    });
  }
  getEndDate(date: Date) {
    return UsefulFunctions.formatDateSimple(this.add_months(date, 12));
  }

  add_months(dt, n)
  {
    return new Date(dt.setMonth(dt.getMonth() - n));
  }

  getLastQuarters(d, count?: number) {
    let periods = [];
    d = d || new Date();
    let m = Math.floor(d.getMonth()/3) + 1;
    m -= m > 4 ? 4 : 0;
    let y = d.getFullYear() + (m == 1? 1 : 0);
    m -= 1;
    for (let i = 0; i < count; i++) {
      if (m === 0) {
        m = 4;
        y -= 1;
      }
      periods.push([y,m].join('Q'));
      m -= 1;
    }
    return periods;
  }

  getDataValueSets(dataSetId: string, orgUnitId: string) {
    this.dataValueSets = [];
    this.getLastQuarters(new Date(), 20).forEach(period => {
      this.service.loadMetaData('dataValueSets', [`orgUnit=${orgUnitId}`, `dataSet=${dataSetId}`, `period=${period}`])
        .subscribe(result => {
        if (result.dataValues){
          this.service.loadAvailableDataValues(result.dataSet).subscribe((data: any) => {
            result['available'] = data.dataValues.length;
            this.dataValueSets.push(result);
          });
        }
      });
    });
  }

  getFiscalYearFormat(period: string): string {
    return UsefulFunctions.getFiscalYear(period);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
