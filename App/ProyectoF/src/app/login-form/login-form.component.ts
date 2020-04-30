import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  loginError = '';


  constructor(
    public builder: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    // Agrupar email y password en un FormGroup
    this.loginForm = this.builder.group({
      email: this.email,
      password: this.password
    });
  }

  ngOnInit(): void { }

  login() {
    if (this.loginForm.valid) {
      this.authService.signIn(this.loginForm.value).subscribe((res: any) => {
        console.log(res);
        if (res.status == 'ERROR') {
          this.loginError = res.msg;
          //this.email.setErrors({failed: true});
          //this.password.setErrors({failed: true});
        } else if (res.status == 'OK') {
          
        }
      });
    }
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Introduce tu correo electrónico';
    }
    else if (this.email.hasError('email')) {
      return 'Formato incorrecto';
    }
  }

  getLoginError() {
    if (this.password.hasError('failed')) {
      return this.loginError;
    }
  }

}
