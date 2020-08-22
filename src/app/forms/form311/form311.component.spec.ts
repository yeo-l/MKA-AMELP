import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Form311Component } from './form311.component';

describe('Form311Component', () => {
  let component: Form311Component;
  let fixture: ComponentFixture<Form311Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Form311Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Form311Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
