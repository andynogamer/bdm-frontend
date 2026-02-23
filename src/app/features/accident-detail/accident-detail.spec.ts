import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentDetail } from './accident-detail';

describe('AccidentDetail', () => {
  let component: AccidentDetail;
  let fixture: ComponentFixture<AccidentDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccidentDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccidentDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
