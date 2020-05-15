import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessEventCardComponent } from './business-event-card.component';

describe('BusinessEventCardComponent', () => {
  let component: BusinessEventCardComponent;
  let fixture: ComponentFixture<BusinessEventCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessEventCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
