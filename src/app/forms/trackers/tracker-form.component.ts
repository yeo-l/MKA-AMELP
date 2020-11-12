import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataValue} from '../../models/dataValues.model';
import {EventModel} from '../../models/event.model';
import {Program} from '../../models/program.model';
import {TrackerService} from '../../services/tracker.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {UsefulFunctions} from '../../shared/useful-functions';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import {MainService} from '../../services/main.service';
import {Observable} from 'rxjs';
import {element} from "protractor";

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
  validatedMessage: string;
  validated: boolean;
  trackerForm = new FormGroup({
    period: new FormControl('', Validators.required),
  });
  workStreams: any = [{}];
  get period(): AbstractControl {return this.trackerForm.get('period'); }

  constructor(private trackerService: TrackerService,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private mainService: MainService) { }

  ngOnInit(): void {
    this.periodList = [];
    this.loading = true;
    this.disabled = true;
    this.sub = this.route.params.subscribe(params => {
      this.trackerCode = params.code;
      this.eventId = params.eventId;
      if (this.eventId){
        this.trackerService.loadMetaData(`events/${this.eventId}`, [`fields=`])
          .subscribe(eventResults => {
            eventResults.dataValues.forEach(dataV => {
              if (dataV.dataElement === 's08WlYaNIno'){
                if (dataV.value){
                  if (dataV.value.split('Q')[1] === '4') {
                    this.periodList = UsefulFunctions.getQuarterlyPeriod(parseInt(dataV.value.split('Q')[0], 10) + 1);
                  } else {
                    this.periodList = UsefulFunctions.getQuarterlyPeriod(parseInt(dataV.value.split('Q')[0], 10));
                  }
                }
              }
            });
          });
      }
      if (this.periodList.length === 0){
        this.getPeriod(null);
      }
    });
  }

  editForm(): void{
    this.disabled = false;
  }
  getOneEvent(eventId: string): void {
    this.trackerService.loadMetaData(`events/${eventId}`, [`fields=`])
      .subscribe((eventResults: any) => {
        eventResults.dataValues.forEach(dataV => {
          this.dataValues.push(this.createDataValue(dataV.dataElement, dataV.value));
        });
        this.eventModel = new EventModel(eventResults.program, eventResults.orgUnit);
        this.eventModel.eventDate = eventResults.eventDate;
        this.eventModel.status = eventResults.status;
        this.toggleReadOnly(this.eventModel);
        document.querySelectorAll('.form-control, .form-check-input').forEach(el => {
          const id = el.getAttribute('id');
          const name = el.getAttribute('name');
          if (el.nodeName === 'SELECT') {
            const select = el as HTMLSelectElement;
            for (let i = 0; i < select.options.length; i++){
              if (select.options[i].value === this.getDataValue(name)){
                select.selectedIndex = i;
                if (id === 'reportingPeriod'){
                  this.trackerForm.patchValue({period: select.options[i].value});
                }
              }
            }
          }
          else if (el.nodeName === 'TEXTAREA' && id !== 'indicatorName'){
            const textarea = el as HTMLTextAreaElement;
            textarea.textContent = this.getDataValue(name);
          }
          else if (el.nodeName === 'INPUT' && id !== 'selectedIndicator' && id !== 'indicatorName'){
            const input = el as HTMLInputElement;
            if (input.type === 'checkbox') {
              if (this.getDataValue(name)) {
                input.checked = true;
              }
            }
            else if (input.type === 'radio') {
              if (this.getDataValue(name)) {
                 input.checked = true;
              }
            } else {
              input.value = this.getDataValue(name);
            }
          }
        });
      });
  }
  getHtmlFile(filePath: string): Observable<string> {
    return this.http.get(filePath, {responseType: 'text'});
  }
  ngAfterViewInit(): void {
    this.loading = true;
    this.sub = this.route.params.subscribe(params => {
      this.trackerCode = params.code;
      this.eventId = params.eventId;
      this.trackerService.loadPrograms(params.id).subscribe((programResult: any) => {
        this.currentProgram = programResult;
        this.getHtmlFile(`assets/trackers/tracker${this.trackerCode}.html`).subscribe(data => {
          const html = data.replace('programName', this.currentProgram?.name).replace('programCode', this.currentProgram?.code);
          this.form.nativeElement.insertAdjacentHTML('beforeend', html);
          document.querySelectorAll('.form-control, .form-check-input').forEach(el => {
            el.addEventListener('change', this.onChange.bind(this));
          });
          if (this.trackerCode === '3.0.1' || this.trackerCode === '3.0.3') {
            this.getDescription();
          }
          if (params.eventId){
            this.getOneEvent(params.eventId);
          }else{
            this.eventModel = new EventModel(this.currentProgram.id, this.currentProgram.organisationUnits[0].id, '', 'ACTIVE', []);
            this.getPeriod(null);
          }
          this.loading = false;
        });
      });
    });
  }
  getDataValue(id: string): string {
    let result: any;
    if (this.dataValues) {
      result = this.dataValues.filter(dv => dv.dataElement === id);
      return result.length > 0 ? result[0].value : null;
    }
  }
  createDataValue(dateElement: string, value: string): any {
     return new DataValue(dateElement, value);
  }
  removeDataValue(name): void {
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
  onChange(event): void {
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
    }
  }
  completeData(): void {
    const title = 'Completed successfully';
    this.eventModel.status = 'COMPLETED';
    if (this.trackerForm.valid && this.validated){
      this.saveData();
      this.mainService.alertSave(title);
    }
    // if (this.trackerForm.invalid) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Oops...',
    //     text: 'Period is required please!',
    //   });
    // }
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  saveData(): void {
    this.validatorRequired();
    const title = 'Saved successfully';
    if (this.trackerForm.valid && this.validated) {
      this.eventModel.eventDate = UsefulFunctions.formatDateSimple(new Date());
      this.eventModel.dataValues = this.dataValues;
      if (this.eventId) {
        this.trackerService.update(this.eventId, this.eventModel).subscribe((result: any) => {
          if (this.eventModel.status === 'COMPLETED'){
            this.router.navigate(['tracker', this.currentProgram.code, this.currentProgram.id]);
          }
          this.mainService.alertSave(title);
        });
        this.mainService.alertSave(title);
      }else {
        this.trackerService.save(this.eventModel).subscribe((result: any) => {
          if (this.eventModel.status === 'COMPLETED'){
            this.router.navigate(['tracker', this.currentProgram.code, this.currentProgram.id]);
          }
          this.getOneEvent(result.response.reference);
          this.mainService.alertSave(title);
        });
      }
    }
    // if (this.trackerForm.invalid)  {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Oops...',
    //     text: 'Reporting Period is required please!',
    //   });
    // }
  }
  getPeriod(year: number): void {
    this.periodList = [];
    this.currentYear = new Date().getFullYear();
    this.periodList = UsefulFunctions.getQuarterlyPeriod(year ? year : this.currentYear);
  }
  previewsYearPeriod(): void {
    this.periodList = [];
    this.currentYear -= 1;
    this.periodList = UsefulFunctions.getQuarterlyPeriod(this.currentYear);
  }
  nextYearPeriod(): void {
    this.periodList = [];
    this.currentYear += 1;
    if (this.currentYear > new Date().getFullYear()){
      this.currentYear -= 1;
    }
    this.periodList = UsefulFunctions.getQuarterlyPeriod(this.currentYear);
  }
  selectPeriod(data): void {
    if (data.target.value){
       this.currentPeriod = data.target.value;
       this.removeDataValue(data.target.name);
       this.dataValues.push(this.createDataValue(data.target.name, data.target.value));
    }
  }
  unCompleteData(id: string): void {
    this.trackerService.loadEvent(id).subscribe(result => {
      this.eventModel = result;
      this.eventModel.status = 'ACTIVE';
      result.status = 'ACTIVE';
      result.completeDate = null;
      this.toggleReadOnly(this.eventModel);
      this.trackerService.save(result).subscribe(res => {
        console.log(res);
      });
    });
  }
  toggleReadOnly(e: EventModel): void {
    document.querySelectorAll('.form-control, .form-check-input').forEach(el => {
      if (e.status === 'COMPLETED') {
        el.setAttribute('disabled', 'true');
      } else {
        el.removeAttribute('disabled');
      }
    });
  }
  getDescription(): void{
    this.description = '';
    this.mainService.getDataStore().subscribe((data: any) => {
      this.workStreams = data.workstreams;
      for (const [key, value] of Object.entries(this.workStreams)) {
        const desc = value as any;
        this.description += '<span class="font-weight-bold">' + desc.name + '</span> : ';
        this.description += '<span class="text-justify">' + desc.description + '</span> <hr>';
      }
      const el = document.querySelector('#tooltip-text');
      el.innerHTML = this.description;
    });
  }
  validatorRequired() {
    this.clearError();
    this.validated = true;
    document.querySelectorAll('.form-control').forEach((e) => {
      let  element = e as HTMLInputElement;
      console.log(element);
      console.log(element.getAttribute('required'));
      if (element.getAttribute('required') !== null && (element.value === null || element.value.trim() === '')) {
        this.validated = false;
        this.validatedMessage = '<span class="text-danger">This field is required</span>'
        const errorId = element.getAttribute('id') +'-error'
        const el = document.querySelector('#'+ errorId);
        el.innerHTML = this.validatedMessage;
        console.log(el);
      }
    });
    this.checkValidated();
  }
  checkValidated(){
    let oneIsChecked = false;
    const BreakException = {};
    try {
      let i = 0;
      document.querySelectorAll('.required').forEach(r => {
        let errorId = '';
        console.log('required-' + (++i));
        let j = 0;
        r.querySelectorAll('.form-check-input').forEach((element) => {
          const e = element as HTMLInputElement;
          console.log('--input-' + (++j));
          if (errorId === '') {
            errorId = e.getAttribute('class').split(' ')[1] + '-error';
            console.log('--message-', errorId);
          }
          if (e.checked) {
            oneIsChecked = true;
            errorId = '';
            throw BreakException;
          }
        });
        if (!oneIsChecked){
          this.validated = false;
          this.validatedMessage = '<span class="text-danger">Select at least one checkbox</span>'
          const el = document.querySelector('#'+ errorId);
          el.innerHTML = this.validatedMessage;
          console.log(el);
        }
      });

    }catch (e){
    }
  }
  clearError(){
    document.querySelectorAll('.error').forEach(e =>{
      e.innerHTML = '';
    });
  }
}
