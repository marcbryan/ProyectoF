import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Event } from 'src/app/services/events/event';

@Component({
  selector: 'dialog-event-info',
  templateUrl: './event-info.dialog.html',
  styleUrls: ['./event-info.dialog.css']
})
export class EventInfoDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public event: Event) {}
}
