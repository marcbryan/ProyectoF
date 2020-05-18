import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './user';
import { IAuthService } from 'src/app/interfaces/IAuthService';
import { Ticket } from './ticket';

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
    localStorage.setItem('user', JSON.stringify(this.currentUser));
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    if (this.currentUser == null) {
      this.currentUser = JSON.parse(localStorage.getItem('user'));
      if (this.currentUser == null) {
        this.logout();
      } 
    }
    return (authToken !== null) ? true : false;
  }

  getTickets(uid: string) {
    let params = new HttpParams().set('uid', uid);
    return this.http.get<any>(this.endpoint+'/tickets', {headers: this.headers, params: params}).pipe(
      map(res => res.data
        .map(ticket => {       
          return new Ticket(
            ticket.code, ticket.event_name, ticket.price,
            ticket.starts, ticket.ends, ticket.location,
            ticket.qty, ticket.bought_at, ticket.img_url
          );
        })
      )
    );
  }

}
