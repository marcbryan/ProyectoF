import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventInfoDialog } from './event-info.dialog';

describe('EventInfoDialog', () => {
  let component: EventInfoDialog;
  let fixture: ComponentFixture<EventInfoDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventInfoDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventInfoDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
