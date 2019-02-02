import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninDeviceFormComponent } from './signin-device-form.component';

describe('SigninDeviceFormComponent', () => {
  let component: SigninDeviceFormComponent;
  let fixture: ComponentFixture<SigninDeviceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigninDeviceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninDeviceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
