import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginStartComponent } from './login-start.component';

describe('LoginStartComponent', () => {
  let component: LoginStartComponent;
  let fixture: ComponentFixture<LoginStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginStartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
