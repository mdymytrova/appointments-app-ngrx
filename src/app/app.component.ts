import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './reducers';
import { isPlatformBrowser } from '@angular/common';
import { relogin } from './auth/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { 
  constructor(
    private store: Store<fromApp.AppState>,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  public ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(relogin());
    }
  }
}
