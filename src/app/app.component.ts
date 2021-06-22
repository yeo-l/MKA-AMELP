import {Component, OnInit} from '@angular/core';
import {DataStore} from './models/dataStore.model';
import {AreaGroup} from './models/areaGroups.model';
import {AggregateService} from './services/aggregate.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  organisationUnits: any[] = [];
  dataStore: DataStore;
  areaGroups: AreaGroup[];
  selectedProject: string;
  hideBar = false;
  title = 'MKA-AMELP';

  constructor(private aggregationService: AggregateService,
              private route: ActivatedRoute,
              private location: Location,) { }
  ngOnInit(): void {
    this.location.onUrlChange((url: string) => {
      if (url.includes('form')) {
        this.hideBar = true;
      }
      else {
        this.hideBar = false;
      }
    });
    this.getAreaOrgUnit();
  }
  getAreaOrgUnit(): void {
    const params: string[] = ['fields=id,name&userDataViewOnly=true&filter=level:eq:' + 3];
    this.aggregationService.loadOrgUnits(params).subscribe((data: any) => {
      this.organisationUnits = data.organisationUnits;
    });
  }
}
