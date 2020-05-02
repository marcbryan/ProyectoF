import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);


  constructor(
    public builder: FormBuilder,
    public snackBar: MatSnackBar,
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
        this.authService.setSession(res.session);
        this.authService.currentUser = res.data;
        this.router.navigate(['/mis-entradas']);
        this.snackBar.open(res.msg, 'Aceptar', {duration: 2000});
      }, (error: any) => {        
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
