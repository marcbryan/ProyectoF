import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from './event';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private endpoint: string = 'http://proyectof.tk/api/events';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, public router: Router) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<any>(this.endpoint).pipe(
      map(res => res.data
        .map(event => {       
          return new Event(
            event._id, event.name, event.description,
            event.price, event.starts, event.ends, event.location,
            event.ticketsForSale, event.tickets_available,
            event.img_url, event.business_id, event.status
          );
        })
      )
    );
  }
}
