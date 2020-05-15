import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../services/events/event';
import { EventsService } from '../services/events/events.service';
import { AuthBusinessService } from '../services/auth-business/auth-business.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-events',
  templateUrl: './business-events.page.html',
  styleUrls: ['./business-events.page.css']
})
export class BusinessEventsPage implements OnInit {
  events: Observable<Event[]>;

  constructor(private eventsService: EventsService, private router: Router, private authService: AuthBusinessService) {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/negocios/login']);
      return;
    }
    this.events = eventsService.getEventsFromBusiness(authService.currentUser.business_id);
  }

  ngOnInit(): void {}

}
