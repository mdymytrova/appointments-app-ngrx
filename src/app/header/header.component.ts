import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService, User } from '../auth/auth.service';
import { logout } from '../auth/store/auth.actions';
import { user } from '../auth/store/auth.selectors';
import { AppState } from '../store/reducers';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn$!: Observable<boolean>;
  isLoggedOut$!: Observable<boolean>;
  isAdmin$!: Observable<boolean | undefined>;
  user$!: Observable<User | null | undefined>;

  constructor(
    public authService: AuthService,
    private store: Store<AppState>
    ) { }

  public ngOnInit(): void {
    this.user$ = this.store.pipe(select(user));
    this.isLoggedIn$ = this.user$.pipe(map(user => !!user));
    this.isAdmin$ = this.user$.pipe(map(user => user?.admin?.verified));
    this.isLoggedOut$ = this.user$.pipe(map(user => !user));
  }

  ngOnDestroy(): void { }

  public onSignOut() {
    this.store.dispatch(logout())
  }

}
