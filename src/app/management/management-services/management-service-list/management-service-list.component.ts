import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MessagesService } from '../../../messages/messages.service';
import { ServiceCategory } from '../../interfaces/category.interface';
import { ManagementService } from '../../interfaces/service.interface';
import { ManagementServicesApiService } from '../services/management-services-api.service';
import { ServiceCategoriesApiService } from '../services/service-categories-api.service';

@Component({
  selector: 'app-management-service-list',
  templateUrl: './management-service-list.component.html',
  styleUrls: ['./management-service-list.component.scss']
})
export class ManagementServiceListComponent implements OnInit, OnDestroy {
  selectedCategory$!: Observable<ServiceCategory | null>;
  managementServices$!: Observable<ManagementService[]>;

  constructor(
    private route: ActivatedRoute,
    private managementServicesApiService: ManagementServicesApiService,
    private serviceCategoriesApiService: ServiceCategoriesApiService,
    private messagesService: MessagesService
  ) { }

  ngOnInit(): void {
    this.selectedCategory$ = this.serviceCategoriesApiService.selectedCategory$;
    this.managementServices$ = this.managementServicesApiService.managementServicesByCategory$;
    this.route.params.subscribe((data: Params) => {
      this.serviceCategoriesApiService.setSelectedCategory(data['id']);
    });
  }

  ngOnDestroy() { }

  public onDelete(service: ManagementService) {
    this.managementServicesApiService.deleteService(service?.id as string).catch(() => {
      this.messagesService.showMessage('Unable to delete service.');
    });
  }

}
