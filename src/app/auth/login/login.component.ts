import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  signUpForm!: FormGroup;
  isSignIn!: boolean;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
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
      const signUpParam = !this.isSignIn ? asAdmin : null;
      this.authService.login(email, password, signUpParam);
    }
  }
  
}
