import {Component, OnInit, ViewChild} from '@angular/core';
import {TrackerService} from '../../services/tracker.service';
import {ActivatedRoute} from '@angular/router';
import {Program} from '../../models/program.model';
import {UsefulFunctions} from '../../shared/useful-functions';
import {Subject} from "rxjs";
import {DataTableDirective} from "angular-datatables";

declare let $: any;

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
  editable: boolean;

  @ViewChild(DataTableDirective, {static: false})
  dtElement?: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private trackerService: TrackerService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    //this.dtTrigger.next();
    this.dtOptions = {
      destroy: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu : [10, 20, 30, 40,50],
      processing: true,
    };
    this.editable = true;
    this.sub = this.route.params.subscribe(params => {
      this.trackerCode = params['code'];
      this.trackerService.loadPrograms(params['id']).subscribe((programResult: any) => {
        this.currentProgram = programResult;
        this.getRegisteredEvents(this.currentProgram.id, this.currentProgram.organisationUnits[0].id);
      });
    });
  }
  getRegisteredEvents(programId: string, orgUnitId: string) {
    this.eventRegistered = [];
    this.trackerService.loadMetaData('events', [`orgUnit=${orgUnitId}`, `program=${programId}`, '&order=scheduledAt'])
      .subscribe((eventResults: any) => {
        eventResults.events.forEach(e => {
          e['period'] = this.getEventPeriod(e.dataValues);
          e['productName'] = this.getEventProductName(e.dataValues);
          this.eventRegistered.push(e);
          this.dtTrigger.next();
        })
    });
  }
  getEventPeriod(dataValues){
    let result = dataValues.filter(dv => dv.dataElement === 's08WlYaNIno');
    return result.length > 0 ? result[0].value : null;
  }
  getEventProductName(dataValues){
    let result = dataValues.filter(dv => dv.dataElement === 'wyGgGonH2he');
    return result.length > 0 ? result[0].value : null;
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
    // $.fn.dataTable.ext.search.pop();
  }
  deleteEvent(eventId: string) {
    this.trackerService.remove(eventId).subscribe( data => {
      location.reload();
    })
  }
  edited() {
    this.editable = false
  }
  getFiscalYearFormat(period: string): string {
    return UsefulFunctions.getFiscalYear(period);
  }
}
