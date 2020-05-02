import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RegisterValidationService } from '../services/register-validation/register-validation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.css']
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup
  email = new FormControl('', [Validators.required, Validators.email]);
  phone = new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
  zipcode = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]);

  constructor(
    public builder: FormBuilder,
    private validator: RegisterValidationService,
    public snackBar: MatSnackBar,
    public authService: AuthService,
    public router: Router
  ) {
    this.registerForm = this.builder.group({
      name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: this.email,
      phone: this.phone,
      city: new FormControl('', [Validators.required]),
      zipcode: this.zipcode,
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    }, {validator: this.validator.matchPassword('password', 'confirmPassword')});
  }

  ngOnInit(): void { }

  register() {
    if (this.registerForm.valid) {
      this.authService.signUp(this.registerForm.value).subscribe((res: any) => {
        this.router.navigate(['/login']);
        this.snackBar.open(res.msg, 'Aceptar', {duration: 2000});
      }, (error: any) => {        
        this.snackBar.open(error.error.msg, 'Aceptar', {duration: 2000});
      });
    }
  }

  get registerFormControl() {
    return this.registerForm.controls;
  }

  getEmailErrorMessage() {
    if (this.email.hasError('email')) {
      return 'Formato incorrecto';
    }
  }

  getPhoneErrorMessage() {
    if (this.phone.errors.minlength || this.phone.errors.maxLength) {      
      return 'Debe tener 9 números';
    }
  }

  getZipcodeErrorMessage() {
    if (this.zipcode.errors.minlength || this.zipcode.errors.maxLength) {      
      return 'Debe tener 5 números';
    }
  }

}
