import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { MessagesService } from '../../../messages/messages.service';
import { AppState } from '../../../store/reducers';
import { ServiceProvider } from '../../interfaces/provider.interface';
import { errorMessage, loading, searchProviders } from '../store/providers.selectors';

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
  
  constructor(
    private messageService: MessagesService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.search = new FormControl('');
    this.loading$ = this.store.select(loading);
    this.message$ = this.store.select(errorMessage);

    this.providers$ = this.search.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(search => {
        return this.store.select(searchProviders(search));
      })
    );
  }

  public ngOnDestroy() { }

  public onDelete(provider: ServiceProvider) {
    // this.managementProviersApiService.deleteProvider(provider?.id as string).catch((err) => {
    //   this.messageService.showMessage('Unable to delete provider.');
    // });
  }
}
