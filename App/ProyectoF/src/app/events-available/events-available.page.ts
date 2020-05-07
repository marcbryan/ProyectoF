import { Component, OnInit } from '@angular/core';
import { EventsService } from '../services/events/events.service';
import { Event } from '../services/events/event';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-events-available',
  templateUrl: './events-available.page.html',
  styleUrls: ['./events-available.page.css']
})
export class EventsAvailablePage implements OnInit {
  events: Observable<Event[]>;

  constructor(private eventsService: EventsService) {
    this.events = eventsService.getEvents();
  }

  ngOnInit(): void {}

}
