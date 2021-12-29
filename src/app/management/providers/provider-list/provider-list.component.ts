import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';
import { MessagesService } from '../../../messages/messages.service';
import { ServiceProvider } from '../../interfaces/provider.interface';
import { ProviderEntityService } from '../store/provider-entity.service';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss'],
  providers: [MessagesService]
})
export class ProviderListComponent implements OnInit, OnDestroy {
  providers$!: Observable<ServiceProvider[]>;
  loading$!: Observable<boolean>;
  message$!: Observable<string | null>;
  form!: FormGroup;
  search!: FormControl;
  private deleteSubscription!: Subscription;
  
  constructor(
    private providerEntityService: ProviderEntityService
  ) { }

  ngOnInit(): void {
    this.search = new FormControl('');
    this.loading$ = this.providerEntityService.loading$;
    this.providers$ = this.search.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      tap(search => this.providerEntityService.setFilter(search)),
      switchMap(data => this.providerEntityService.filteredEntities$)
    );
  }

  public ngOnDestroy() {
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }

  public onDelete(provider: ServiceProvider) {
    this.deleteSubscription = this.providerEntityService.delete(provider).subscribe(
      (data) => { }, 
      (error) => this.message$ = of('Unable delete provider.')
    );
  }
}
