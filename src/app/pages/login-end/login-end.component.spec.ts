import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginEndComponent } from './login-end.component';

describe('LoginEndComponent', () => {
  let component: LoginEndComponent;
  let fixture: ComponentFixture<LoginEndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginEndComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
