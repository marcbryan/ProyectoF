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

  signUp(user: BusinessUser) {
    return this.http.post<any>(this.endpoint+'/create', user);
  }
  
  setSession(res) {
    const expiresAt = moment().add(res.expiresIn, 'second');
    localStorage.setItem('b_access_token', res.token);
    localStorage.setItem('b_expires_at', JSON.stringify(expiresAt.valueOf()));
  }
  
  logout() {
    localStorage.removeItem('b_access_token');
    localStorage.removeItem('b_expires_at');
  }
  
  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('b_access_token');
    return (authToken !== null) ? true : false;
  }

}
