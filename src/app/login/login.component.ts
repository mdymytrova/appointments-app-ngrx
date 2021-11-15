import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm!: FormGroup;
  public signUpForm!: FormGroup;
  public isSignIn!: boolean;
  public errorMessage!: string | null;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private auth: AngularFireAuth) { 
    this.isSignIn = true;
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

  public ngOnDestroy() {}

  public onFormSelect() {
    this.isSignIn = !this.isSignIn;
    if (this.isSignIn) {
      this.signUpForm.reset();
    } else {
      this.loginForm.reset();
    }
    this.errorMessage = null;
  }

  public onSubmit() {
    const form = this.isSignIn ? this.loginForm : this.signUpForm;
    if (!form.valid) {
      return;
    }

    const { email, password, asAdmin } = form.value;
    if (this.isSignIn) {
      this.authService.login(email, password)
        .then((errorMessage) => this.errorMessage = errorMessage);
    } else {
      this.authService.emailSignup(email, password, asAdmin)
        .then(() => this.errorMessage = 'Permission to create an account is disabled at the moment.');
    }
  }
  
  public onSignOut() {
    this.authService.logout();
  }

}
