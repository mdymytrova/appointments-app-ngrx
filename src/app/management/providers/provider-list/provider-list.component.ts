import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceProvider } from '../../interfaces/provider.interface';
import { ManagementProvidersApiService } from '../services/providers-api.service';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss']
})
export class ProviderListComponent implements OnInit, OnDestroy {
  providers$!: Observable<ServiceProvider[]>;
  
  constructor(private managementProviersApiService: ManagementProvidersApiService) { }

  ngOnInit(): void {
    this.providers$ = this.managementProviersApiService.providers$;
  }

  public ngOnDestroy() { }

  public onDelete(provider: ServiceProvider) {
    this.managementProviersApiService.deleteProvider(provider?.id as string);
  }
}
