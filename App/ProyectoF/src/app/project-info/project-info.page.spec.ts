import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInfoPage } from './project-info.page';

describe('ProjectInfoPage', () => {
  let component: ProjectInfoPage;
  let fixture: ComponentFixture<ProjectInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectInfoPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
