import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataValue} from '../../models/dataValues.model';
import {EventModel} from '../../models/event.model';
import {Program} from '../../models/program.model';
import {TrackerService} from '../../services/tracker.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {UsefulFunctions} from '../../shared/useful-functions';

@Component({
  selector: 'app-tracker-form',
  templateUrl: './tracker-form.component.html',
  styleUrls: ['./tracker-form.component.css']
})
export class TrackerFormComponent implements OnInit, AfterViewInit {
  trackerCode: string;
  dataValues: DataValue[] = [];
  loading: boolean;
  eventModel: EventModel;
  currentProgram: Program;
  private sub: any;
  @ViewChild('form') form: ElementRef;
  eventId: string;
  periodList: any;
  currentPeriod: any;
  private currentYear: number;

  constructor(private trackerService: TrackerService,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient) { }

  ngOnInit(): void {
    this.loading = true;
    this.getPeriod();
  }

  getOneEvent(eventId: string) {
    this.trackerService.loadMetaData(`events/${eventId}`, [`fields=`])
      .subscribe((eventResults: any) => {
        // this.eventModel = eventResults;
        eventResults.dataValues.forEach(dataV => {
          this.dataValues.push(this.createDataValue(dataV.dataElement, dataV.value));
        });
        this.eventModel = new EventModel(eventResults.program, eventResults.orgUnit);
        // this.eventModel.program = eventResults.program;
        // this.eventModel.orgUnit = eventResults.orgUnit;
        this.eventModel.eventDate = eventResults.eventDate;
        this.eventModel.status = eventResults.status;
        // this.eventModel.dataValues = this.dataValues;
        console.log('eventModel', this.eventModel);
        console.log('dataValues', this.dataValues);
        document.querySelectorAll('.form-control, .form-check-input').forEach(el => {
          const id = el.getAttribute('id');
          const name = el.getAttribute('name');
          if (el.nodeName === 'SELECT') {
            let select = el as HTMLSelectElement;
            for (let i = 0; i< select.options.length; i++){
              console.log(select.options[i].value);
              if (select.options[i].value === this.getDataValue(name)){
                select.selectedIndex = i;
              }
            }
          }
          else if (el.nodeName === 'TEXTAREA' && id !== 'indicatorName'){
            let textarea = el as HTMLTextAreaElement;
            textarea.textContent = this.getDataValue(name);
          }
          else if (el.nodeName === 'INPUT' && id !== 'selectedIndicator' && id !== 'indicatorName'){
            let input = el as HTMLInputElement;
            if (input.type === 'checkbox') {
              if (this.getDataValue(name))
                input.checked = true;
            }
            else if (input.type === 'radio') {
              if (this.getDataValue(name))
                 input.checked = true;
            }
            else {
              input.value = this.getDataValue(name);
            }
          }
          // else{
          //   if (id !== 'selectedIndicator' && id !== 'indicatorName'){
          //     const type = el.getAttribute('type');
          //     if (type === 'checkbox') {
          //       if (this.getDataValue(name))
          //         el.setAttribute('checked', 'checked');
          //     }
          //     if (type === 'radio'){
          //       if (this.getDataValue(name) === el.getAttribute('value')){
          //         el.setAttribute('selected', 'selected');
          //       }
          //     }
          //     else {
          //       el.setAttribute('value', this.getDataValue(name));
          //     }
          //   }
          // }
        });
      });
  }

  getHtmlFile(filePath: string) {
    return this.http.get(filePath, {responseType: 'text'});
  }

  ngAfterViewInit(): void {
    this.loading = true;
    this.sub = this.route.params.subscribe(params => {
      this.trackerCode = params['code'];
      this.eventId = params['eventId'];
      this.trackerService.loadPrograms(params['id']).subscribe((programResult: any) => {
        this.currentProgram = programResult;

        this.getHtmlFile(`assets/trackers/tracker${this.trackerCode}.html`).subscribe(data => {
          let html = data.replace('programName', this.currentProgram?.name).replace('programCode', this.currentProgram?.code);
          this.form.nativeElement.insertAdjacentHTML('beforeend', html);
          document.querySelectorAll('.form-control, .form-check-input').forEach(el => {
            el.addEventListener('change', this.onChange.bind(this));
          });
          if (params['eventId']){
            this.getOneEvent(params['eventId']);
          }else{
            this.eventModel= new EventModel(this.currentProgram.id, this.currentProgram.organisationUnits[0].id, '', 'ACTIVE', []);
          }
          this.loading = false;
        });
      });
    });
  }

  getDataValue(id: string):string {
    let result: any;
    if (this.dataValues) {
      result = this.dataValues.filter(dv => dv.dataElement === id);
      // console.log(result);
      return result.length > 0 ? result[0].value : null;
    }
  }

  createDataValue(dateElement: string, value: string): any {
     return new DataValue(dateElement, value);
   // return {dataElement:dateElement, value:value};
  }

  removeDataValue(name) {
    console.log('name to remove', name);
    if (this.dataValues) {
      const result = this.dataValues.filter(dv => dv.dataElement === name);
       console.log('dataValue to remove',result);
      if (result.length) {
        const index: number = this.dataValues.indexOf(result[0]);
        if (index !== -1) {
          this.dataValues.splice(index);
        }
      }
    }
  }

  onChange(event) {
    console.log(event.target.value);
    if (event.target){
      this.removeDataValue(event.target.name);
      if (event.target.type === 'checkbox' || event.target.type === 'radio') {
        if (event.target.checked === true) {
          console.log('checkbox value',event.target.value);
          this.dataValues.push(this.createDataValue(event.target.name, event.target.value));
        }
      } else {
        if (event.target.value){
          this.dataValues.push(this.createDataValue(event.target.name, event.target.value));
        }
      }
    }
    console.log('dataValues', this.dataValues);
  }

  completeData() {
    this.eventModel.status = 'COMPLETED';
    this.saveData();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  saveData() {
    this.eventModel.eventDate = UsefulFunctions.formatDateSimple(new Date());
    this.eventModel.dataValues = this.dataValues;
    if (this.eventId) {
      this.trackerService.update(this.eventId, this.eventModel).subscribe(result => {
        console.log(result);
        this.router.navigate(['tracker',this.currentProgram.code, this.currentProgram.id]);
      });
    }else {
      this.trackerService.save(this.eventModel).subscribe(result => {
        // console.log(result);
        this.router.navigate(['tracker',this.currentProgram.code, this.currentProgram.id]);
      })
    }

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
  selectPeriod(data){
    if (data.target.value){
      // this.currentPeriod = data.target.value;
      this.dataValues.push(this.createDataValue(data.target.name, data.target.value));
      console.log(this.eventModel);
      console.log('data target',data.target.options);
      for (let i = 0; i< data.target.options.length; i++){
        console.log(data.target.options[i].value);
      }
    }
    // else {
    //   this.currentPeriod = '';
    //   this.loading = false;
    // }
  }
}
