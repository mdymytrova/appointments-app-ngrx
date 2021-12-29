import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import { isPlatformBrowser } from '@angular/common';
import { relogin } from './auth/store/auth.actions';
import { Observable } from 'rxjs';
import { loading } from './auth/store/auth.selectors';
import { AppState } from './store/reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loading$!: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  public ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(relogin());
    }
    this.loading$ = this.store.select(loading);
  }
}
