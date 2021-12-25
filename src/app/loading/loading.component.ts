import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loading } from '../auth/auth.selectors';
import * as fromApp from '../reducers';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  show$!: Observable<boolean>;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.show$ = this.store.select(loading);
  }

}
