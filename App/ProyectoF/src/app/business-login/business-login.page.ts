import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AuthBusinessService } from '../services/auth-business/auth-business.service';

@Component({
  selector: 'app-business-login',
  templateUrl: './business-login.page.html',
  styleUrls: ['./business-login.page.css']
})
export class BusinessLoginPage implements OnInit {
  loginForm: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);


  constructor(
    public builder: FormBuilder,
    public snackBar: MatSnackBar,
    public authService: AuthBusinessService,
    public router: Router,
    private loadingBar: LoadingBarService
  ) {
    // Agrupar email y password en un FormGroup
    this.loginForm = this.builder.group({
      email: this.email,
      password: this.password
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/negocios/mis-eventos']);
    }
  }

  login() {
    if (this.loginForm.valid) {
      this.loadingBar.start();
      this.authService.signIn(this.loginForm.value).subscribe((res: any) => {
        this.authService.currentUser = res.data;
        this.authService.setSession(res.session);
        this.loadingBar.complete();
        this.router.navigate(['/negocios/mis-eventos']);
        this.snackBar.open(res.msg, 'Aceptar', {duration: 2000});
      }, (error: any) => {
        this.loadingBar.complete();
        this.snackBar.open(error.error.msg, 'Aceptar', {duration: 2000});
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

}
