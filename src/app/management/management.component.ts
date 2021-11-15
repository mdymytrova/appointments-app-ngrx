import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ManagementTask } from './interfaces/management-task.interface';
import { ManagementTasksApiService } from './services/management-tasks-api.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit, OnDestroy {
  public mobileQuery!: MediaQueryList;
  public taskList$!: Observable<ManagementTask[]>;
 
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public managementTasksApiService: ManagementTasksApiService) {
    this.mobileQuery = media.matchMedia('(max-width: 1100px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.taskList$ = this.managementTasksApiService.managementTasks$;
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }

  private mobileQueryListener: () => void;

}
