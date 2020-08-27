import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataValue} from '../../models/dataValues.model';
import {EventModel} from '../../models/event.model';
import {Program} from '../../models/program.model';
import {TrackerService} from '../../services/tracker-service';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {UsefulFunctions} from '../../../shared/useful-functions';

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

  constructor(private trackerService: TrackerService,
              private route: ActivatedRoute,
              private http: HttpClient) { }

  ngOnInit(): void {
    this.loading= true;
    // this.sub = this.route.params.subscribe(params => {
    //   this.trackerCode = params['code'];
    //   // this.trackerService.loadPrograms(params['id']).subscribe((programResult: any) => {
    //   //   this.currentProgram = programResult;
    //   //   if (params['eventId']){
    //   //     this.getOneEvent(this.currentProgram.id, this.currentProgram.organisationUnits[0].id, params['eventId']);
    //   //   }
    //   // });
    // });
  }

  getOneEvent(programId: string, orgUnitId: string, trackedEntityInstance) {
    this.trackerService.loadMetaData('events', [`orgUnit=${orgUnitId}`, `program=${programId}`, '&order=dueDate', `trackedEntityInstance=${trackedEntityInstance}`])
      .subscribe((eventResults: any) => {
        this.eventModel = eventResults;
        document.querySelectorAll('.form-control, .form-check-input').forEach(el => {
          const id = el.getAttribute('id');
          const name = el.getAttribute('name');
          if (id !== 'selectedIndicator' && id !== 'indicatorName'){
            const type = el.getAttribute('type');
            if (type === 'checkbox') {
              if (this.getDataValue(name))
                el.setAttribute('checked', 'checked');
            } else {
              el.setAttribute('value', this.getDataValue(name));
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
      this.trackerService.loadPrograms(params['id']).subscribe((programResult: any) => {
        this.currentProgram = programResult;
        this.eventModel= new EventModel(this.currentProgram.id, this.currentProgram.organisationUnits[0].id, '', 'ACTIVE', []);

        this.getHtmlFile(`assets/tracker${this.trackerCode}.html`).subscribe(data => {
          let html = data.replace('programName', this.currentProgram?.name).replace('programCode', this.currentProgram?.code);
          this.form.nativeElement.insertAdjacentHTML('beforeend', html);
          document.querySelectorAll('.form-control, .form-check-input').forEach(el => {
            el.addEventListener('change', this.onChange.bind(this));
          });
          if (params['eventId']){
            this.getOneEvent(this.currentProgram.id, this.currentProgram.organisationUnits[0].id, params['eventId']);
          }
          this.loading = false;
        });
      });
    });
  }

  getDataValue(id: string):string {
    let result: any
    if (this.eventModel.dataValues) {
       result = this.eventModel.dataValues.filter(dv => dv.dataElement === id);
      console.log(result);
      return result.length ? result[0].value : null;
    }
  }

  createDataValue(dateElement: string, value: string): DataValue {
    return new DataValue(dateElement, '', value);
  }

  removeDataValue(name) {
    if (this.eventModel.dataValues) {
      const result = this.eventModel.dataValues.filter(dv => dv.dataElement === name);
      console.log(result);
      if (result.length) {
        const index: number = this.eventModel.dataValues.indexOf(result[0]);
        if (index !== -1) {
          this.eventModel.dataValues.splice(index);
        }
      }
    }
  }

  onChange(event) {
    console.log(event);
    if (event.target){
      // console.log('selected element : ', event.target.name);
      // console.log('selected element value', event.target.value);
      this.removeDataValue(event.target.name);
      if (event.target.type === 'checkbox') {
        if (event.target.checked === true) {
          this.eventModel.dataValues.push(this.createDataValue(event.target.name, '1'));
        }
      } else {
        if (event.target.value){
          this.eventModel.dataValues.push(this.createDataValue(event.target.name, event.target.value));
        }
      }
      console.log('event payload obtained : ', this.eventModel);
    }
  }

  completeData() {
    this.eventModel.eventDate = UsefulFunctions.formatDateSimple(new Date());
    this.eventModel.status = 'COMPLETED';
    console.log(this.eventModel);
    this.trackerService.postEvent(this.eventModel).subscribe(result => {
      console.log(result);
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
