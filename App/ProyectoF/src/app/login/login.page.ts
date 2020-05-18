import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);
  password = new FormControl('', [Validators.required]);


  constructor(
    public builder: FormBuilder,
    public snackBar: MatSnackBar,
    public authService: AuthService,
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
      this.router.navigate(['u/mis-entradas']);
    }
  }

  login() {
    if (this.loginForm.valid) {
      this.loadingBar.start();
      this.authService.signIn(this.loginForm.value).subscribe((res: any) => {
        this.authService.currentUser = res.data;
        this.authService.setSession(res.session);
        this.loadingBar.complete();
        this.router.navigate(['u/mis-entradas']);
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
    else if (this.email.hasError('email') || this.email.hasError('pattern')) {
      return 'Formato incorrecto';
    }
  }

}
