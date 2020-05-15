import { Component, OnInit, Input } from '@angular/core';
import { Event } from 'src/app/services/events/event';
import { MatDialog } from '@angular/material/dialog';
import { EventInfoDialog } from '../dialogs/event-info/event-info.dialog';

@Component({
  selector: 'business-event-card',
  templateUrl: './business-event-card.component.html',
  styleUrls: ['./business-event-card.component.css']
})
export class BusinessEventCardComponent implements OnInit {
  @Input() event: Event;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  openDialog() {
    this.dialog.open(EventInfoDialog, {data: this.event});
  }

}
