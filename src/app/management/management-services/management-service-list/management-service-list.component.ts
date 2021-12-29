import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { ServiceCategory } from '../../interfaces/category.interface';
import { ManagementService } from '../../interfaces/service.interface';
import { ManagementServiceEntityService } from '../store/management-service-entity.service';

@Component({
  selector: 'app-management-service-list',
  templateUrl: './management-service-list.component.html',
  styleUrls: ['./management-service-list.component.scss']
})
export class ManagementServiceListComponent implements OnInit, OnDestroy {
  selectedCategory$!: Observable<ServiceCategory | null>;
  managementServices$!: Observable<ManagementService[]>;
  message$!: Observable<string>;
  private deleteSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private managementServiceEntityService: ManagementServiceEntityService
  ) { }

  ngOnInit(): void {
    this.managementServices$ = this.managementServiceEntityService.filteredEntities$;
    this.route.params.subscribe((data: Params) => {
      this.managementServiceEntityService.setFilter(data['id']);
    });
  }

  ngOnDestroy() {
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }

  public onDelete(service: ManagementService) {
    this.deleteSubscription = this.managementServiceEntityService.delete(service).subscribe(
      () => {},
      (error) => this.message$ = of('Unable to delete a service.')
    );
  }

}
