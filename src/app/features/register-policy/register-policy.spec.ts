import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPolicy } from './register-policy';

describe('RegisterPolicy', () => {
  let component: RegisterPolicy;
  let fixture: ComponentFixture<RegisterPolicy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPolicy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPolicy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
