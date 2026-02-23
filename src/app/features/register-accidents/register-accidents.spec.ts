import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAccidents } from './register-accidents';

describe('RegisterAccidents', () => {
  let component: RegisterAccidents;
  let fixture: ComponentFixture<RegisterAccidents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterAccidents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterAccidents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
