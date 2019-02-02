import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninStartFormComponent } from './signin-start-form.component';

describe('SigninStartFormComponent', () => {
  let component: SigninStartFormComponent;
  let fixture: ComponentFixture<SigninStartFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigninStartFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninStartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
