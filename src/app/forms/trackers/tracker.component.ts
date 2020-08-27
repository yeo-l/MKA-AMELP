import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TrackerService} from '../../services/tracker-service';
import {ActivatedRoute} from '@angular/router';
import {EventModel} from '../../models/event.model';
import {DataValue} from '../../models/dataValues.model';
import {HttpClient} from '@angular/common/http';
import {Program} from '../../models/program.model';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})
export class TrackerComponent implements OnInit {
  private sub: any;
  eventRegistered: EventModel[];
  currentProgram: Program;
  trackerCode: string;

  constructor(private trackerService: TrackerService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      console.log('param', params['id']);
      this.trackerCode = params['code'];
      this.trackerService.loadPrograms(params['id']).subscribe((programResult: any) => {
        this.currentProgram = programResult;
        this.getRegisteredEvents(this.currentProgram.id, this.currentProgram.organisationUnits[0].id);
      });
    });
  }

  getRegisteredEvents(programId: string, orgUnitId: string) {
    this.trackerService.loadMetaData('events', [`orgUnit=${orgUnitId}`, `program=${programId}`, '&order=dueDate']).subscribe((eventResults: any) => {
      this.eventRegistered = eventResults.events as EventModel[];
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
