import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { AppState } from '../store/reducers';
import { ManagementTask } from './interfaces/management-task.interface';
import { errorMessage, managementTasks } from './store/management-tasks.selectors';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit, OnDestroy {
  public mobileQuery!: MediaQueryList;
  public taskList$!: Observable<ManagementTask[]>;
  message$!: Observable<string | null>;
 
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private store: Store<AppState>
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 1100px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.taskList$ = this.store.select(managementTasks);
    this.message$ = this.store.select(errorMessage);
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }

  private mobileQueryListener: () => void;

}
