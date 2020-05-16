import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessRegisterPage } from './business-register.page';

describe('BusinessRegisterPage', () => {
  let component: BusinessRegisterPage;
  let fixture: ComponentFixture<BusinessRegisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessRegisterPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
