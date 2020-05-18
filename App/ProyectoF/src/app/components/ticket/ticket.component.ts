import { Component, OnInit, Input } from '@angular/core';
import { Ticket } from 'src/app/services/auth/ticket';

@Component({
  selector: 'ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {
  @Input() ticket: Ticket;

  constructor() {}

  ngOnInit(): void {}

}
