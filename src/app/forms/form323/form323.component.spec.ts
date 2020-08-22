import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Form323Component } from './form323.component';

describe('Form323Component', () => {
  let component: Form323Component;
  let fixture: ComponentFixture<Form323Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Form323Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Form323Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
