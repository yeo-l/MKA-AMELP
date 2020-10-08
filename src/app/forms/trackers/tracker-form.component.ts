import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataValue} from '../../models/dataValues.model';
import {EventModel} from '../../models/event.model';
import {Program} from '../../models/program.model';
import {TrackerService} from '../../services/tracker.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {UsefulFunctions} from '../../shared/useful-functions';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {MainService} from "../../services/main.service";

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
  message: string;
  private sub: any;
  @ViewChild('form') form: ElementRef;
  eventId: string;
  periodList: any;
  private currentYear: number;
  currentPeriod: any;
  disabled: boolean;
  selectValue: string;
  description: string;
  trackerForm = new FormGroup({
    period: new FormControl('', Validators.required),
  });
  workStreams: any = [{}];
  get period(){return this.trackerForm.get('period')}

  constructor(private trackerService: TrackerService, private route: ActivatedRoute, private router: Router, private http: HttpClient,
              private mainService: MainService) { }

  ngOnInit(): void {
    this.getDescription();
    this.periodList = [];
    this.loading = true;
    this.disabled = true;
    this.sub = this.route.params.subscribe(params => {
      this.trackerCode = params['code'];
      this.eventId = params['eventId'];
      if (this.eventId){
        this.trackerService.loadMetaData(`events/${this.eventId}`, [`fields=`])
          .subscribe(eventResults => {
            eventResults.dataValues.forEach(dataV => {
              if (dataV.dataElement === 's08WlYaNIno'){
                if (dataV.value){
                  this.periodList = UsefulFunctions.getQuarterlyPeriod(parseInt(dataV.value.split('Q')[0]))
                }
              }
            });
          })
      }
      if (this.periodList.length === 0){
        this.getPeriod(null);
      }
    });
  }
  editeForm(){
    this.disabled = false;
  }
  getOneEvent(eventId: string) {
    this.trackerService.loadMetaData(`events/${eventId}`, [`fields=`])
      .subscribe((eventResults: any) => {
        eventResults.dataValues.forEach(dataV => {
          this.dataValues.push(this.createDataValue(dataV.dataElement, dataV.value));
        });
        this.eventModel = new EventModel(eventResults.program, eventResults.orgUnit);
        this.eventModel.eventDate = eventResults.eventDate;
        this.eventModel.status = eventResults.status;
        document.querySelectorAll('.form-control, .form-check-input').forEach(el => {
          const id = el.getAttribute('id');
          const name = el.getAttribute('name');
          if (el.nodeName === 'SELECT') {
            let select = el as HTMLSelectElement;
            for (let i = 0; i< select.options.length; i++){
              if (select.options[i].value === this.getDataValue(name)){
                select.selectedIndex = i;
                if (id === 'reportingPeriod'){
                  this.trackerForm.patchValue({period: select.options[i].value});
                }
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
            this.getPeriod(null);
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
      return result.length > 0 ? result[0].value : null;
    }
  }
  createDataValue(dateElement: string, value: string): any {
     return new DataValue(dateElement, value);
  }
  removeDataValue(name) {
    if (this.dataValues) {
      const result = this.dataValues.filter(dv => dv.dataElement === name);
      if (result.length) {
        const index: number = this.dataValues.indexOf(result[0]);
        if (index !== -1) {
          this.dataValues.splice(index, 1);
        }
      }
    }
  }
  onChange(event) {
    if (event.target){
      this.removeDataValue(event.target.name);
      if (event.target.type === 'checkbox' || event.target.type === 'radio') {
        if (event.target.checked === true) {
          this.dataValues.push(this.createDataValue(event.target.name, event.target.value));
        }
      } else {
        if (event.target.value){
          this.dataValues.push(this.createDataValue(event.target.name, event.target.value));
        }
      }
      if (event.target.id === 'workStream') {
        let name = event.target.value;
        let description = this.workStreams[name].description;
        let el = document.querySelector('#wSDesc');
        // el.innerHTML = description;
        el.setAttribute('title', description);
      }
    }
  }
  getDescription(){
    this.mainService.getDataStore().subscribe(data => {
      this.workStreams = data.workstreams;
    })
  }
  completeData() {
    let title = "completed successfully";
    this.eventModel.status = 'COMPLETED';
    if (this.trackerForm.valid){
      this.saveData();
      this.router.navigate(['tracker',this.currentProgram.code, this.currentProgram.id]);
      this.mainService.alertSave(title);
    }
    if (this.trackerForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Period is required please!',
      })
    }
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  saveData() {
    let title = "Save successfully";
    if (this.trackerForm.valid) {
      this.eventModel.eventDate = UsefulFunctions.formatDateSimple(new Date());
      this.eventModel.dataValues = this.dataValues;
      if (this.eventId) {
        this.trackerService.update(this.eventId, this.eventModel).subscribe(result => {
          console.log(result);
          this.router.navigate(['tracker',this.currentProgram.code, this.currentProgram.id]);
          this.mainService.alertSave(title);
        });
        this.mainService.alertSave(title);
      }else {
        this.trackerService.save(this.eventModel).subscribe(result => {
         this.router.navigate(['tracker',this.currentProgram.code, this.currentProgram.id]);
          this.mainService.alertSave(title);
        })
      }
    }
    if (this.trackerForm.invalid)  {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Reporting Period is required please!',
      })
    }
  }
  getPeriod(year: number){
    this.periodList = [];
    this.currentYear = new Date().getFullYear();
    this.periodList = UsefulFunctions.getQuarterlyPeriod(year? year : this.currentYear);
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
       this.currentPeriod = data.target.value;
       this.removeDataValue(data.target.name);
       this.dataValues.push(this.createDataValue(data.target.name, data.target.value));
    }
  }
}
