import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessToolbarComponent } from './business-toolbar.component';

describe('BusinessToolbarComponent', () => {
  let component: BusinessToolbarComponent;
  let fixture: ComponentFixture<BusinessToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
