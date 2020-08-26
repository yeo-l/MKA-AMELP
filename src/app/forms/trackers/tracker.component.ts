import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TrackerService} from '../../services/tracker-service';
import {ActivatedRoute} from '@angular/router';
import {EventModel} from '../../models/event.model';
import {DataValue} from '../../models/dataValues.model';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})
export class TrackerComponent implements OnInit, AfterViewInit {
  private sub: any;
  eventRegistered: EventModel[];
  currentProgram: any;
  mode: string;
  trackerCode: string;
  dataValues: DataValue[] = [];
  eventModel: EventModel;

  @ViewChild('form') form: ElementRef;


  constructor(private trackerService: TrackerService,
              private route: ActivatedRoute,
              private http: HttpClient,
              private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.mode = params['mode'];
      this.trackerCode = params['code'];
      this.trackerService.loadPrograms(params['id']).subscribe((programResult: any) => {
        this.currentProgram = programResult;

        if (this.mode === 'list') {
          this.getRegisteredEvents(this.currentProgram.id, this.currentProgram.organisationUnits[0].id);
        } else if (this.mode === 'edit'){
          this.getOneEvent(this.currentProgram.id, this.currentProgram.organisationUnits[0].id, params['eventId']);
        }
      });
    });
  }

  getHtmlFile(filePath: string) {
    return this.http.get(filePath, {responseType: 'text'});
  }

  getRegisteredEvents(programId: string, orgUnitId: string) {
    this.trackerService.loadMetaData('events', [`orgUnit=${orgUnitId}`, `program=${programId}`, '&order=dueDate']).subscribe((eventResults: any) => {
      this.eventRegistered = eventResults.events as EventModel[];
    });
  }

  getOneEvent(programId: string, orgUnitId: string, trackedEntityInstance) {
    // trackedEntityInstance=
    this.trackerService.loadMetaData('events', [`orgUnit=${orgUnitId}`, `program=${programId}`, '&order=dueDate', `trackedEntityInstance=${trackedEntityInstance}`])
      .subscribe((eventResults: any) => {
      this.eventModel = eventResults;
    });
  }

  ngAfterViewInit(): void {
    this.getHtmlFile(`assets/tracker${this.trackerCode}.html`).subscribe(data => {
      this.form.nativeElement.insertAdjacentHTML('beforeend', data);
      document.querySelectorAll('.form-control').forEach(el =>{
        el.addEventListener('change', this.onChange.bind(this));
      })
    });
    if (this.dataValues.length !== 0) {
      this.dataValues.forEach(dataValue => {
        let input = document.querySelector(`input[name=${dataValue.dataElement}]`)
        input.nodeType
      })
    }
    // this.elementRef.nativeElement.querySelector('input[type=text]').addEventListener('change', this.onChange.bind(this))
  }

  onChange(event) {
    console.log(event);
  }
}
