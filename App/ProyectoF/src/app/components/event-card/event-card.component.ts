import { Component, OnInit, Input } from '@angular/core';
import { Event } from 'src/app/services/events/event';
import { MatDialog } from '@angular/material/dialog';
import { EventInfoDialog } from '../dialogs/event-info/event-info.dialog';

@Component({
  selector: 'event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {
  @Input() event: Event;  

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  openDialog() {
    this.dialog.open(EventInfoDialog, {data: this.event});
  }

}
