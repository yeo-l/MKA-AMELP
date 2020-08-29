import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataValueSet} from '../../models/dataSetValues.model';
import {DataSet} from '../../models/dataSets.model';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AggregateService} from '../../services/aggregate.service';
import {UsefulFunctions} from '../../shared/useful-functions';

@Component({
  selector: 'app-aggregate-form',
  templateUrl: './aggregate-form.component.html',
  styleUrls: ['./aggregate-form.component.css']
})
export class AggregateFormComponent implements OnInit, AfterViewInit {
  dataSetCode: string;
  loading: boolean;
  dataValueSet: DataValueSet;
  currentDataSet: DataSet;
  currentPeriod: string;
  private sub: any;
  currentYear: number;

  period: string;
  periodList: any;

  @ViewChild('form') form: ElementRef;

  constructor(private service: AggregateService,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient) { }

  ngOnInit(): void {
    this.loading = false;
    this.getPeriod();
    this.sub = this.route.params.subscribe(params => {
      this.dataSetCode = params['code'];
      this.currentPeriod = params['period'];

      this.service.loadOneDataSet(params['id'], ['fields=id,name,description,code,organisationUnits[id,name]']).subscribe((result: any) => {
        console.log(result);
        this.currentDataSet = result;

        if (this.currentPeriod) {
          this.loadForm();
        }
      });
    });
  }

  ngAfterViewInit(): void {
  }

  getPeriod(){
    this.periodList = [];
    this.currentYear = new Date().getFullYear();
    this.periodList = UsefulFunctions.getQuarterlyPeriod(this.currentYear);
  }
  previewsYearPeriod(){
    this.periodList = [];
    this.currentYear -= 1;
    this.periodList = UsefulFunctions.getQuarterlyPeriod(this.currentYear);
  }
  nextYearPeriod(){
    this.periodList = [];
    this.currentYear += 1;
    if (this.currentYear > new Date().getFullYear()){
      this.currentYear -= 1;
    }
    this.periodList = UsefulFunctions.getQuarterlyPeriod(this.currentYear);
  }

  loadForm() {
    this.loading = true;
    this.getHtmlFile(`assets/aggregates/aggregate${this.dataSetCode}.html`).subscribe(data => {

      document.querySelector('#input-form').innerHTML = '';
      this.form.nativeElement.insertAdjacentHTML('beforeend', data);
      if (this.currentPeriod){
        document.querySelectorAll('.form-control').forEach(el => {
          if(el.getAttribute('name') !== 'reportingPeriod')
            el.addEventListener('change', this.onChange.bind(this));
        });
        this.getOneAggregateValues(this.currentPeriod, this.currentDataSet?.id, this.currentDataSet?.organisationUnits[0]?.id);
      }
      this.loading = false;
    });
  }

  getHtmlFile(filePath: string) {
    return this.http.get(filePath, {responseType: 'text'});
  }

  getOneAggregateValues(period: string, dataSetId: string, orgUnit: string) {
    this.service.loadOneDataSetValues(`dataValueSets?period=${period}&dataSet=${dataSetId}&orgUnit=${orgUnit}`)
      .subscribe((result: any) => {
        this.dataValueSet = result;
        // console.log(result);
        document.querySelectorAll('.form-control').forEach(el => {
          const name = el.getAttribute('name');
          if (this.getDataValue(name))
          el.setAttribute('value', this.getDataValue(name));
        });
      });
  }

  getDataValue(name: string): string {
    let result: any;
    if (this.dataValueSet.dataValues) {
      result = this.dataValueSet.dataValues.filter(dv => dv.dataElement === name.split('-')[0] && dv.categoryOptionCombo === name.split('-')[1]);
      return result.length ? result[0].value : '';
    }
  }

  onChange(event) {
    let name: string = event.target.name;
    if (event.target.value){
      if (name.split('-').length > 1)
        this.service.save(name.split('-')[0], this.currentDataSet?.organisationUnits[0].id, this.currentPeriod, event.target.value, name.split('-')[1])
          .subscribe(() => {});
      else  {
        this.service.save(name.split('-')[0], this.currentDataSet?.organisationUnits[0].id, this.currentPeriod, event.target.value)
          .subscribe(() => {});
      }
    } else {
      if (name.split('-').length > 1)
        this.service.remove(name.split('-')[0], this.currentDataSet?.organisationUnits[0].id, this.currentPeriod, name.split('-')[1])
          .subscribe(() => {});
      else  {
        this.service.remove(name.split('-')[0], this.currentDataSet?.organisationUnits[0].id, this.currentPeriod)
          .subscribe(() => {});
      }
    }
  }

  selectPeriod(data){
    if (data.target.value){
      this.currentPeriod = data.target.value;
      this.loadForm();
    } else {
      this.currentPeriod = '';
    }
  }

  completeForm() {
    this.service.completeRegistration(UsefulFunctions.completeDataSet(this.currentDataSet?.organisationUnits[0].id, this.currentPeriod, this.currentDataSet?.id))
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['aggregate',this.currentDataSet?.code, this.currentDataSet?.id]);
      });
  }
}
