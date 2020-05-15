import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessEventsPage } from './business-events.page';

describe('BusinessEventsPage', () => {
  let component: BusinessEventsPage;
  let fixture: ComponentFixture<BusinessEventsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessEventsPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
