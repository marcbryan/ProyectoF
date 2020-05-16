import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterValidationService } from '../services/register-validation/register-validation.service';
import { AuthBusinessService } from '../services/auth-business/auth-business.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-business-register',
  templateUrl: './business-register.page.html',
  styleUrls: ['./business-register.page.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class BusinessRegisterPage implements OnInit {
  isLinear = false;
  businessForm: FormGroup;
  userForm: FormGroup;
  zipcode = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]);
  phone = new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
  email = new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);
  phone2 = new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]);

  constructor(
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private validator: RegisterValidationService,
    private authService: AuthBusinessService,
    private router: Router,
    private loadingBar: LoadingBarService
  ) {}

  ngOnInit() {
    this.businessForm = this._formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zipcode: this.zipcode,
      phone: this.phone
    });
    this.userForm = this._formBuilder.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: this.email,
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      phone: this.phone2
    }, {validator: this.validator.matchPassword('password', 'confirmPassword')});
  }

  register() {
    if (this.businessForm.valid && this.userForm.valid) {
      let data: any = {};
      data.business = this.businessForm.value;
      data.user = this.userForm.value;
      delete data.user.confirmPassword;
      this.loadingBar.start();

      this.authService.signUp(data)
        .subscribe((res: any) => {
          this.loadingBar.complete();
          this.router.navigate(['/negocios/login']);
          this.snackBar.open(res.msg, 'Aceptar', {duration: 2000});
        }, (error: any) => {
          this.loadingBar.complete();
          let errorMsg = '';
          if (error.status == 403) {
            errorMsg = error.error.msg;
          } else {
            errorMsg = 'Error '+error.status+': '+error.statusText;
          }
          this.snackBar.open(errorMsg, 'Aceptar', {duration: 2000});
        });
    } else {
      this.snackBar.open('Faltan campos por rellenar', 'Aceptar', {duration: 2000});
      console.log('error');
    }
  }

  getEmailErrorMessage() {
    if (this.email.hasError('email') || this.email.hasError('pattern'))
      return 'Formato incorrecto';
  }

  getPhoneErrorMessage() {   
    if (this.phone.errors.minlength || this.phone.errors.maxlength) 
      return 'Debe tener 9 números';
  }

  getPhone2ErrorMessage() {
    if (this.phone2.errors.minlength || this.phone2.errors.maxlength)     
      return 'Debe tener 9 números';
  }

  getZipcodeErrorMessage() {
    if (this.zipcode.errors.minlength || this.zipcode.errors.maxlength)
      return 'Debe tener 5 números';
  }

}
