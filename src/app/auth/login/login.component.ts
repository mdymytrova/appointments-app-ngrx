import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../auth.service';
import * as fromAppState from '../../store/reducers';
import { Observable, Subscription } from 'rxjs';
import { errorMessage } from '../store/auth.selectors';
import { loginStart, signupStart } from '../store/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  signUpForm!: FormGroup;
  isSignIn!: boolean;
  error$!: Observable<string | null>;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<fromAppState.AppState>
  ) {
    this.isSignIn = true;
    this.error$ = this.store.select(errorMessage);
  }

  public ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      asAdmin: [false]
    });
  }

  ngOnDestroy(): void { }

  public onFormSelect() {
    this.isSignIn = !this.isSignIn;
    if (this.isSignIn) {
      this.signUpForm.reset();
    } else {
      this.loginForm.reset();
    }
  }

  public onSubmit() {
    const form = this.isSignIn ? this.loginForm : this.signUpForm;
    if (form.valid) {
      const { email, password, asAdmin } = form.value;
      if (this.isSignIn) {
        this.store.dispatch(loginStart({email, password}));
      } else {
        this.store.dispatch(signupStart({email, password, asAdmin}))
      }

    }
  }
  
}
