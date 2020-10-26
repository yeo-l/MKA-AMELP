import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataValueSet} from '../../models/dataSetValues.model';
import {DataSet} from '../../models/dataSets.model';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AggregateService} from '../../services/aggregate.service';
import {UsefulFunctions} from '../../shared/useful-functions';
import IMask from 'imask';
import {MainService} from '../../services/main.service';

@Component({
  selector: 'app-aggregate-form',
  templateUrl: './aggregate-form.component.html',
  styleUrls: ['./aggregate-form.component.css']
})
export class AggregateFormComponent implements OnInit {
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

  constructor(private service: AggregateService, private route: ActivatedRoute, private router: Router, private http: HttpClient,
              private mainService: MainService) { }

  ngOnInit(): void {
    this.loading = false;
    this.getPeriod();
    this.sub = this.route.params.subscribe(params => {
      this.dataSetCode = params['code'];
      if (params['period']){
        this.currentPeriod = params['period'];
        if (this.currentPeriod.split('Q')[1] === '4') {
          this.currentYear = parseInt(this.currentPeriod.split('Q')[0]) + 1;
        } else {
          this.currentYear = parseInt(this.currentPeriod.split('Q')[0]);
        }
        this.getPeriod();
      }
      this.service.loadOneDataSet(params['id'], ['fields=id,name,description,code,organisationUnits[id,name]'])
        .subscribe((result: any) => {
          this.currentDataSet = result;
          if (this.currentPeriod) {
            this.loadForm();
          }
        });
    });
  }
  getPeriod(){
    this.periodList = [];
    this.currentYear = this.currentYear ? this.currentYear : new Date().getFullYear();
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
      const elements = document.querySelectorAll('input.form-control').forEach(el => {
        const e = el as HTMLElement;
        e.setAttribute('class', 'text-center form-control');
        IMask(e, {
          mask: Number
        });
      });
      if (this.currentPeriod){
        document.querySelectorAll('input.form-control').forEach(el => {
          if (el.getAttribute('name') !== 'reportingPeriod'){
            el.addEventListener('change', this.onChange.bind(this));
          }
        });
        this.getOneAggregateValues(this.currentPeriod, this.currentDataSet?.id, this.currentDataSet?.organisationUnits[0]?.id);
      }
      this.loading = false;
    });
  }
  toggleReadOnly(dataSet: DataValueSet){
      document.querySelectorAll('input.form-control').forEach(el => {
        if (dataSet.completeDate){
          el.setAttribute('disabled', 'true');
        }
        else{
          el.removeAttribute('disabled');
        }

      });
  }
  getHtmlFile(filePath: string) {
    return this.http.get(filePath, {responseType: 'text'});
  }
  getOneAggregateValues(period: string, dataSetId: string, orgUnit: string) {
    this.service.loadOneDataSetValues(`dataValueSets?period=${period}&dataSet=${dataSetId}&orgUnit=${orgUnit}`)
      .subscribe((result: any) => {
        this.dataValueSet = result;
        this.toggleReadOnly(this.dataValueSet);
        document.querySelectorAll('.form-control').forEach(el => {
          if (el.getAttribute('id') !== 'reportingPeriod'){
            const name = el.getAttribute('name');
            if (this.getDataValue(name))
              el.setAttribute('value', this.getDataValue(name));
          }
        });
      });
  }
  getDataValue(name: string): string {
    let result: any;
    if (this.dataValueSet.dataValues) {
      if (name.split('-').length > 1)
        result = this.dataValueSet.dataValues.filter(dv => dv.dataElement === name.split('-')[0] && dv.categoryOptionCombo === name.split('-')[1]);
      if (name.split('-').length === 1)
        result = this.dataValueSet.dataValues.filter(dv => dv.dataElement === name);
      return result.length ? result[0].value : '';
    }
  }
  onChange(event) {
    let name: string = event.target.name;
    let title = "Saved successfully";
    if (event.target.value){
      if (name.split('-').length > 1){
        this.service.save(name.split('-')[0], this.currentDataSet?.organisationUnits[0].id, this.currentPeriod, event.target.value, name.split('-')[1])
          .subscribe(() => {
            this.mainService.alertSave(title);
          });
      }else {
        this.service.save(name, this.currentDataSet?.organisationUnits[0].id, this.currentPeriod, event.target.value)
          .subscribe(() => {
            this.mainService.alertSave(title);
          });
      }
    } else {
      let title = "Removed successfully";
      if (name.split('-').length > 1)
        this.service.remove(name.split('-')[0], this.currentDataSet?.organisationUnits[0].id, this.currentPeriod, name.split('-')[1])
          .subscribe(() => {
            this.mainService.alertSave(title);
          });
      else  {
        this.service.remove(name, this.currentDataSet?.organisationUnits[0].id, this.currentPeriod)
          .subscribe(() => {
            this.mainService.alertSave(title);
          });
      }
    }
  }
  selectPeriod(){
    if (this.currentPeriod){
      this.loadForm();
    } else {
      this.loading = false;
    }
  }
  completeForm() {
    let title = "completed successfully";
    this.service.completeRegistration(UsefulFunctions.completeDataSet(this.currentDataSet?.organisationUnits[0].id, this.currentPeriod, this.currentDataSet?.id))
      .subscribe(response => {
        this.mainService.alertSave(title);
        this.router.navigate(['aggregate',this.currentDataSet?.code, this.currentDataSet?.id]);
      });
  }
  unCompleteForm() {
    let title = "Data uncompleted successfully, your can edit the form";
    this.service.unCompleteRegistration(this.currentDataSet?.id, this.currentDataSet?.organisationUnits[0].id, this.currentPeriod)
      .subscribe(response => {
        this.mainService.alertSave(title);
        this.dataValueSet.completeDate = null;
        this.toggleReadOnly(this.dataValueSet);
        // this.router.navigate(['aggregate',this.currentDataSet?.code, this.currentDataSet?.id]);
      }, error => {
        console.log(error);
      });
  }
}
