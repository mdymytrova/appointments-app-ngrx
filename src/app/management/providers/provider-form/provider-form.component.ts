import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { DayLabel } from '../../../enums';
import { MessagesService } from '../../../messages/messages.service';
import { DaySchedule, ServiceProvider, ServiceProviderContactInfo, ServiceProviderService, ServiceView } from '../../interfaces/provider.interface';
import { ManagementService } from '../../interfaces/service.interface';
import { ManagementServiceEntityService } from '../../management-services/store/management-service-entity.service';
import { ProviderEntityService } from '../store/provider-entity.service';

@Component({
  selector: 'app-provider-form',
  templateUrl: './provider-form.component.html',
  styleUrls: ['./provider-form.component.scss'],
  providers: [MessagesService]
})
export class ProviderFormComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  public mode!: string;
  public daysConfigurationError: string[] | null = null;
  private initialFormValue!: ServiceProvider;
  private formDataSubscription!: Subscription;
  private saveSubscription!: Subscription;
  message$!: Observable<string | null>;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private providerEntityService: ProviderEntityService,
    private managementServiceEntityService: ManagementServiceEntityService
  ) {
    this.mode = this.route.snapshot.data['mode'];
  }

  public get daysControls() {
    return (<FormArray>this.form.get('schedule')).controls;
  }

  public get servicesControls() {
    return (<FormArray>this.form.get('services'))?.controls;
  }

  public get servicesControl() {
    return (<FormArray>this.form.get('services'));
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      contactInfo: this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        phone: [''],
        email: ['', Validators.email]
      }),
      services: [[]],
      schedule: this.formBuilder.array(this.getDaysControls())
    });

    const provider$ = this.route.snapshot.params['id'] ? this.providerEntityService.getByKey(this.route.snapshot.params['id']).pipe(first()) : of(null);
    const services$ = this.managementServiceEntityService.entities$.pipe(first());
    
    this.formDataSubscription = forkJoin({
      provider: provider$,
      services: services$
    }).subscribe(({provider, services }) => {
      this.setServicesControls(services);
      if (provider) {
        this.patchFormWithProviderData(provider);
      }
      this.initialFormValue = { ...this.form.value };
    });
  }

  ngOnDestroy() {
    if (this.formDataSubscription) {
      this.formDataSubscription.unsubscribe();
    }

    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
  }
  
  public onSave() {
    if (this.form.valid) {
      const { contactInfo, services, schedule } = this.form.value;
      this.runDaysConfigurationValidator(schedule);
      if (!this.daysConfigurationError) {
        const onSave = this.mode === 'create' ?
          this.createProvider(contactInfo, services, schedule) :
          this.updateProvider(contactInfo, services, schedule);

        this.saveSubscription = onSave.subscribe(
          (data) => this.router.navigate(['/manage', 'service-providers']), 
          (error) => this.message$ = of(`Unable to ${this.mode} a provider.`)
        );
      }
    } else {
      this.form.get('contactInfo.firstName')?.markAsTouched();
      this.form.get('contactInfo.lastName')?.markAsTouched();
    }
  }
  
  public onDiscard() {
    this.form.patchValue({
      contactInfo: this.initialFormValue?.contactInfo,
      services: this.initialFormValue?.services,
      schedule: this.initialFormValue?.schedule
    });
    this.form.get('contactInfo.firstName')?.markAsUntouched();
    this.form.get('contactInfo.lastName')?.markAsUntouched();
    this.daysConfigurationError = null;
  }

  private getDaysControls() {
    return Object.entries(DayLabel).map((entry) => {
      const group = this.formBuilder.group({
        name: [entry[1]],
        day: [entry[0]],
        available: [false],
        start: ['08:00'],
        end: ['17:00'],
        breakStart: ['12:00'],
        breakEnd: ['13:00']
      });
      return group;
    });
  }
  
  private setServicesControls(services: ManagementService[] = []) {
    this.form.setControl('services', this.formBuilder.array(this.getServicesControls(services)));
  }

  private getServicesControls(services: ManagementService[]) {
    return services.map((availableService) => {
      const group = this.formBuilder.group({
        name: [availableService.name],
        checked: [false],
        id: [availableService.id]
      });
      return group;
    });
  }

  private patchFormWithProviderData(provider: ServiceProvider) {
    this.form.patchValue({
      contactInfo: provider.contactInfo
    });
    provider.schedule.forEach((schedule: DaySchedule) => {
      (<FormArray>this.form.get('schedule'))?.at(parseInt(schedule.day)).patchValue({
        ...schedule
      });
    });
    provider.services.forEach((service) => {
      const serviceIndex = this.servicesControls.findIndex(control => control.value?.id == service?.id);
      if (serviceIndex >= 0) {
        this.servicesControl.at(serviceIndex).patchValue({ checked: true })
      }
    });
  }

  public compareWith(service1: ServiceProviderService, service2: ServiceProviderService): boolean {
    return service1 && service2 && service1.id === service2.id;
  }

  public navigateBack() {
    if (this.mode === 'create') {
      this.router.navigate(['../'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../../'], {relativeTo: this.route});
    }
  }

  private runDaysConfigurationValidator(schedule: DaySchedule[]) {
    const daysWithMisconfiguration = schedule.filter((day: DaySchedule) => {
      return day.available && (!day.start || !day.end);
    });
    if (daysWithMisconfiguration.length) {
      this.daysConfigurationError = daysWithMisconfiguration.map((day: DaySchedule) => day.name);
    } else {
      this.daysConfigurationError = null;
    }
  }

  private createProvider(contactInfo: ServiceProviderContactInfo, services: ServiceView[], schedule: DaySchedule[]) {
    const updatedProvider = {
      contactInfo,
      services: this.mapServicesForSave(services),
      schedule: this.mapScheduleForSave(schedule)
    }
    return this.providerEntityService.add(updatedProvider);
  }

  private updateProvider(contactInfo: ServiceProviderContactInfo, services: ServiceView[], schedule: DaySchedule[]) {
    const updatedProvider = {
      id: this.route.snapshot.paramMap.get('id') as string,
      contactInfo,
      services: this.mapServicesForSave(services),
      schedule: this.mapScheduleForSave(schedule)
    }

    return this.providerEntityService.update(updatedProvider);
  }

  private mapServicesForSave(services: ServiceView[] = []) {
    return services.filter((service: ServiceView) => service.checked).map((service: ServiceView) => {
      return {
        id: service.id
      }
    })
  }

  private mapScheduleForSave(schedule: DaySchedule[] = []) {
    return schedule.filter((service: DaySchedule) => service.available);
  }
}
