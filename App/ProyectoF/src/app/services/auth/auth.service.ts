import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './user';
import { IAuthService } from 'src/app/interfaces/IAuthService';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class AuthService implements IAuthService {
  endpoint: string = 'http://proyectof.tk/api/user';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser: any;

  constructor(private http: HttpClient, public router: Router) {}

  signIn(user: User) {
    return this.http.post<any>(this.endpoint+'/login', user);
  }

  signUp(user: User) {
    return this.http.post<any>(this.endpoint+'/create', user);
  }
 
  setSession(res) {
    const expiresAt = moment().add(res.expiresIn, 'second');
    localStorage.setItem('access_token', res.token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_at');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

}
