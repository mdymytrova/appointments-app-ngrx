import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { MessagesService } from '../../../messages/messages.service';
import { ServiceCategory } from '../../interfaces/category.interface';
import { ManagementService } from '../../interfaces/service.interface';
import { ManagementServicesApiService } from '../services/management-services-api.service';
import { ServiceCategoriesApiService } from '../services/service-categories-api.service';
import { HOURS, MINUTES } from './time.constant';

@Component({
  selector: 'app-management-service-form',
  templateUrl: './management-service-form.component.html',
  styleUrls: ['./management-service-form.component.scss']
})
export class ManagementServiceFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  mode!: string;
  timeOptions = {
    hours: HOURS,
    minutes: MINUTES
  };
  private initialFormValue!: ManagementService;
  serviceCategories$!: Observable<ServiceCategory[]>;
  service$!: Observable<ManagementService>;
  selectedCategory!: ServiceCategory | null;
  private serviceFormDataSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private managementServicesApiService: ManagementServicesApiService,
    private route: ActivatedRoute,
    private router: Router,
    private serviceCategoriesApiService: ServiceCategoriesApiService,
    private messagesService: MessagesService
  ) { }

  public get duration() {
    return this.form.get('duration');
  }

  ngOnInit(): void {
    this.managementServicesApiService.setSelectedService(this.route.snapshot.params['id']);
    this.mode = this.route.snapshot.data['mode'];
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      category: [{id: 'general', name: 'None'}],
      description: [''],
      duration: this.formBuilder.group({
        hours: ['0'],
        minutes: ['30']
      })
    });

    this.initialFormValue = { ...this.form.value };

    this.serviceFormDataSubscription = forkJoin({
      selelectedCategory: this.serviceCategoriesApiService.selectedCategory$,
      selectedService: this.managementServicesApiService.selectedService$
    }).subscribe(({selectedService, selelectedCategory}) => {
      this.selectedCategory = selelectedCategory;

      if (selelectedCategory) {
        this.form.patchValue({ category: selelectedCategory });
      }

      if (selectedService) {
        this.form.patchValue({
          name: selectedService.name,
          description: selectedService.description,
          category: selectedService.category
        });
        this.duration?.patchValue({
          hours: selectedService.duration.hours,
          minutes: selectedService.duration.minutes
        });
      }
      this.initialFormValue = { ...this.form.value };
    });
    this.serviceCategories$ = this.serviceCategoriesApiService.serviceCategories$;
  }

  ngOnDestroy() {
    if (this.serviceFormDataSubscription) {
      this.serviceFormDataSubscription.unsubscribe();
    }
  }

  public onSave() {
    if (this.form.valid) {
      if (this.mode === 'create') {
        this.createService();
      } else {
        this.editService();
      }
    } else {
      this.form.get('name')?.markAsTouched();
    }
  }

  public onDiscard() {
    this.form.patchValue({
      name: this.initialFormValue?.name,
      description: this.initialFormValue?.description,
      category: this.initialFormValue?.category
    });
    this.duration?.patchValue({
      hours: this.initialFormValue?.duration?.hours,
      minutes: this.initialFormValue?.duration?.minutes
    });
  }

  public navigateBack() {
    let path = this.mode === 'create' ? ['../'] : ['../../'];
    if (this.selectedCategory) {
      path = [...path, this.selectedCategory?.id || ''];
    }
    this.router.navigate(path, {relativeTo: this.route});
  }

  private createService() {
    const { name, description, duration, category } = this.form.value;
    this.managementServicesApiService.createService({
      name, 
      duration,
      description,
      category: category.id === 'general' ? '' : category
    }).then(() => {
      this.navigateBack();
    }, () => {
      this.messagesService.showMessage('Unable to create service.');
    });
  }

  private editService() {
    const { name, description, duration, category } = this.form.value;
    this.managementServicesApiService.updateService({
      name, 
      duration,
      description,
      category: category.id === 'general' ? '' : category
    }, this.route.snapshot.paramMap.get('id') as string).then(() => {
      this.navigateBack();
    }, () => {
      this.messagesService.showMessage('Unable to edit service.');
    });
  }

  public compareWith(service1: any, service2: any): boolean {
    return service1 && service2 && service1.id === service2.id;
  }

}
