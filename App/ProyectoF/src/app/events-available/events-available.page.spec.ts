import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsAvailablePage } from './events-available.page';

describe('EventsAvailablePage', () => {
  let component: EventsAvailablePage;
  let fixture: ComponentFixture<EventsAvailablePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsAvailablePage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsAvailablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
