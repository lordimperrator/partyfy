import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninPlaylistFormComponent } from './signin-playlist-form.component';

describe('SigninPlaylistFormComponent', () => {
  let component: SigninPlaylistFormComponent;
  let fixture: ComponentFixture<SigninPlaylistFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigninPlaylistFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninPlaylistFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
