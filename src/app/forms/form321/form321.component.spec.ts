import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Form321Component } from './form321.component';

describe('Form321Component', () => {
  let component: Form321Component;
  let fixture: ComponentFixture<Form321Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Form321Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Form321Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
