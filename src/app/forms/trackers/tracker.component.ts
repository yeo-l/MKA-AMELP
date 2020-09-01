import {Component, OnInit} from '@angular/core';
import {TrackerService} from '../../services/tracker.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Program} from '../../models/program.model';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})
export class TrackerComponent implements OnInit {
  private sub: any;
  eventRegistered: any;
  currentProgram: Program;
  trackerCode: string;

  constructor(private trackerService: TrackerService,
              private route: ActivatedRoute,  private router: Router) { }

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
      this.eventRegistered = eventResults.events;
      console.log(eventResults);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  deleteEvent(eventId: string) {
    this.trackerService.remove(eventId).subscribe( data => {
      // this.router.navigate(['tracker',this.currentProgram.code, this.currentProgram.id]);
      location.reload();
    })
  }
}
