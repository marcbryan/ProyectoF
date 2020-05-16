import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
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

  /**
   * Hace una llamada a la API de eventos para obtener una lista de los eventos disponibles
   */
  getEvents(): Observable<Event[]> {
    return this.http.get<any>(this.endpoint, {headers: this.headers}).pipe(
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

  /**
   * Hace una llamada a la API de eventos para obtener todos los eventos de un negocio
   * @param {string} id El ID del negocio
   */
  getEventsFromBusiness(id): Observable<Event[]> {
    let url = this.endpoint+'/business';
    let params = new HttpParams().set('id', id);  
    return this.http.get<any>(url, {headers: this.headers, params: params}).pipe(
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

  /**
   * Hace una llamada a la API de eventos para crear un evento
   * @param {Event} event - Un objeto del evento que queremos crear con los datos correspondientes
   */
  createEvent(event: Event) {
    return this.http.post<any>(this.endpoint+'/create', event, {headers: this.headers});
  }
}
