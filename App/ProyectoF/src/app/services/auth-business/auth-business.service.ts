import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import * as moment from 'moment';
import { IAuthService } from 'src/app/interfaces/IAuthService';
import { BusinessUser } from './business-user';

@Injectable({
  providedIn: 'root'
})
export class AuthBusinessService implements IAuthService {
  endpoint: string = 'http://proyectof.tk/api/business';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser: any;

  constructor(private http: HttpClient, public router: Router) {}
  
  signIn(user: BusinessUser) {
    return this.http.post<any>(this.endpoint+'/login', user);
  }

  signUp(data: any) {
    return this.http.post<any>(this.endpoint+'/register', data);
  }
  
  setSession(res) {
    const expiresAt = moment().add(res.expiresIn, 'second');
    localStorage.setItem('b_access_token', res.token);
    localStorage.setItem('b_expires_at', JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem('b_user', JSON.stringify(this.currentUser));
  }
  
  logout() {
    localStorage.removeItem('b_access_token');
    localStorage.removeItem('b_expires_at');
    localStorage.removeItem('b_user');
  }
  
  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('b_access_token');
    if (this.currentUser == null) {
      this.currentUser = JSON.parse(localStorage.getItem('b_user'));
      if (this.currentUser == null) {
        this.logout();
      } 
    }
    return (authToken !== null) ? true : false;
  }

}
