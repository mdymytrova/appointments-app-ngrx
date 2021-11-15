import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DayLabel } from '../../../enums';
import { DaySchedule, ServiceProvider, ServiceProviderContactInfo, ServiceProviderService, ServiceView } from '../../interfaces/provider.interface';
import { ManagementService } from '../../interfaces/service.interface';
import { ManagementServicesApiService } from '../../management-services/services/management-services-api.service';
import { ManagementProvidersApiService } from '../services/providers-api.service';
@Component({
  selector: 'app-provider-form',
  templateUrl: './provider-form.component.html',
  styleUrls: ['./provider-form.component.scss']
})
export class ProviderFormComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  public mode!: string;
  public daysConfigurationError: string[] | null = null;
  private initialFormValue!: ServiceProvider;
  private services: ManagementService[] = [];
  private servicesSubscription!: Subscription;
  private provider!: ServiceProvider | null;
  private providersSubscription!: Subscription;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private managementServicesApiService: ManagementServicesApiService, private managementProvidersApiService: ManagementProvidersApiService, private router: Router) {
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
    this.managementProvidersApiService.setSelectedProvider(this.route.snapshot.params['id']);
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

    this.servicesSubscription = this.managementServicesApiService.managementServices$.subscribe(services => {
      this.services = services;
      if (this.services && this.services.length) {
        this.form.setControl('services', this.formBuilder.array(this.getServicesControls()));
        this.initialFormValue = { ...this.form.value };
      }
    });

    this.providersSubscription = this.managementProvidersApiService.selectedProvider$.subscribe(provider => {
      this.provider = provider;
      if (this.provider) {
        this.form.patchValue({
          contactInfo: this.provider.contactInfo
        });
        this.provider.schedule.forEach((schedule: DaySchedule) => {
          (<FormArray>this.form.get('schedule'))?.at(parseInt(schedule.day)).patchValue({
            ...schedule
          });
        });
        this.provider.services.forEach((service) => {
          const serviceIndex = this.servicesControls.findIndex(control => control.value?.id == service?.id);
          if (serviceIndex >= 0) {
            this.servicesControl.at(serviceIndex).patchValue({ checked: true })
          }
        });
        this.initialFormValue = { ...this.form.value };
      }
    });
  }

  ngOnDestroy() {
    if (this.providersSubscription) {
      this.providersSubscription.unsubscribe();
    }
    if (this.servicesSubscription) {
      this.servicesSubscription.unsubscribe();
    }
  }

  public onSave() {
    if (this.form.valid) {
      const { contactInfo, services, schedule } = this.form.value;
      this.runDaysConfigurationValidator(schedule);
      if (!this.daysConfigurationError) {
        if (this.mode === 'create') {
          this.createProvider(contactInfo, services, schedule);
        } else {
          this.updateProvider(contactInfo, services, schedule)
        }
      }
    } else {
      this.form.get('name')?.markAsTouched();
    }
  }

  public onDiscard() {
    this.form.patchValue({
      contactInfo: this.initialFormValue?.contactInfo,
      services: this.initialFormValue?.services,
      schedule: this.initialFormValue?.schedule
    });
    this.form.get('name')?.markAsUntouched();
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

  private getServicesControls() {
    return this.services.map((availableService) => {
      const group = this.formBuilder.group({
        name: [availableService.name],
        checked: [false],
        id: [availableService.id]
      });
      return group;
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
    this.managementProvidersApiService.createProvider({
      contactInfo,
      services: this.mapServicesForSave(services),
      schedule: this.mapScheduleForSave(schedule),
    }).then((data) => {
      this.router.navigate(['../'], {relativeTo: this.route});
    });
  }

  private updateProvider(contactInfo: ServiceProviderContactInfo, services: ServiceView[], schedule: DaySchedule[]) {
    this.managementProvidersApiService.updateProvider({
      contactInfo,
      services: this.mapServicesForSave(services),
      schedule: this.mapScheduleForSave(schedule)
    }, this.route.snapshot.paramMap.get('id') as string).then((data) => {
      this.router.navigate(['../../'], { relativeTo: this.route });
    });
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
