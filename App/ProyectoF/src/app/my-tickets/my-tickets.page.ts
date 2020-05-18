import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { Ticket } from '../services/auth/ticket';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.page.html',
  styleUrls: ['./my-tickets.page.css']
})
export class MyTicketsPage implements OnInit {
  tickets: Observable<Ticket[]>;

  constructor(private authService: AuthService, private router: Router) { 
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/negocios/login']);
      return;
    }
    this.tickets = authService.getTickets(authService.currentUser._id);
  }

  ngOnInit(): void {}

}
