import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './user';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  endpoint: string = 'http://proyectof.tk/api/user';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser: any;

  constructor(private http: HttpClient, public router: Router) {}

  /**
   * Función para iniciar sesión
   */
  signIn(user: User) {
    return this.http.post<any>(this.endpoint+'/login', user);
  }

  signUp() {

  }

  /**
   * Asigna un token y su expiración en LocalStorage
   * @param res Objeto con un token y su expiración
   */
  setSession(res) {
    const expiresAt = moment().add(res.expiresIn, 'second');
    localStorage.setItem('access_token', res.token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  /**
   * Comprueba si el usuario esta logeado mediante un token acceso
   * @return {boolean} true si está logeado, false si no lo está
   */
  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

}
