import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartycodeComponent } from './partycode.component';

describe('PartycodeComponent', () => {
  let component: PartycodeComponent;
  let fixture: ComponentFixture<PartycodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartycodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartycodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
