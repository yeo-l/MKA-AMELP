import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Form322Component } from './form322.component';

describe('Form322Component', () => {
  let component: Form322Component;
  let fixture: ComponentFixture<Form322Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Form322Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Form322Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
