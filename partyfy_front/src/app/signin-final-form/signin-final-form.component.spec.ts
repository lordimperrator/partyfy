import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninFinalFormComponent } from './signin-final-form.component';

describe('SigninFinalFormComponent', () => {
  let component: SigninFinalFormComponent;
  let fixture: ComponentFixture<SigninFinalFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigninFinalFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninFinalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
