import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ServiceProvider } from '../../interfaces/provider.interface';
import { ManagementProvidersApiService } from '../services/providers-api.service';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss']
})
export class ProviderListComponent implements OnInit, OnDestroy {
  providers$!: Observable<ServiceProvider[]>;
  form!: FormGroup;
  search!: FormControl;
  
  constructor(
    private managementProviersApiService: ManagementProvidersApiService,
  ) { }

  ngOnInit(): void {
    this.search = new FormControl('');

    this.providers$ = this.search.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(search => {
        return this.filterProviders(search);
      })
    );
  }

  private filterProviders(search: string) {
    return this.managementProviersApiService.providers$.pipe(
      map(providers => {
        return providers.filter(provider => {
          const name = `${provider?.contactInfo?.firstName} ${provider?.contactInfo?.lastName}`.toLowerCase() || '';
          return name.indexOf(search.toLowerCase()) >= 0;
        })
      })
    )
  }

  public ngOnDestroy() { }

  public onDelete(provider: ServiceProvider) {
    this.managementProviersApiService.deleteProvider(provider?.id as string);
  }
}
