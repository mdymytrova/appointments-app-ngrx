import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { ServiceCategory } from '../../interfaces/category.interface';
import { ManagementService } from '../../interfaces/service.interface';
import { ManagementServiceEntityService } from '../store/management-service-entity.service';
import { ServiceCategoryEntityService } from '../store/service-category-entity.service';
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
  message$!: Observable<string>;
  private serviceFormDataSubscription!: Subscription;
  private saveSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private managementServiceEntityService: ManagementServiceEntityService,
    private serviceCategoryEntityService: ServiceCategoryEntityService,
  ) { }

  public get duration() {
    return this.form.get('duration');
  }

  ngOnInit(): void {
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

    this.serviceCategories$ = this.serviceCategoryEntityService.entities$;

    if (this.mode === 'edit') {
      this.serviceFormDataSubscription = this.managementServiceEntityService.getByKey(this.route.snapshot.params['id']).pipe(
        first(),
        tap(service => {
          if (service) {
            this.form.patchValue({
              name: service.name, 
              description: service.description,
              category: service.category || {id: 'general', name: 'General'}
            });
            this.duration?.patchValue({
              hours: service.duration.hours,
              minutes: service.duration.minutes
            });
          }
          this.initialFormValue = { ...this.form.value };
        })
      ).subscribe()
    }
  }

  ngOnDestroy() {
    if (this.serviceFormDataSubscription) {
      this.serviceFormDataSubscription.unsubscribe();
    }
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
  }

  public onSave() {
    if (this.form.valid) {
      const onSave = this.mode === 'create' ?
        this.createService() :
        this.editService();

      this.saveSubscription = onSave.subscribe(
        (data) => this.navigateBack(), 
        (error) => this.message$ = of(`Unable to ${this.mode} a service.`)
      );
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
    const service = {
      name,
      duration,
      description,
      category: category.id === 'general' ? '' : category
    }
    return this.managementServiceEntityService.add(service);
  }

  private editService() {
    const { name, description, duration, category } = this.form.value;
    const service = {
      id: this.route.snapshot.params['id'],
      name,
      duration,
      description,
      category: category.id === 'general' ? '' : category
    }
    return this.managementServiceEntityService.update(service);
  }

  public compareWith(service1: any, service2: any): boolean {
    return service1 && service2 && service1.id === service2.id;
  }

}
