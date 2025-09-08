import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalationPopupComponent } from './escalation-popup.component';

describe('EscalationPopupComponent', () => {
  let component: EscalationPopupComponent;
  let fixture: ComponentFixture<EscalationPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EscalationPopupComponent]
    });
    fixture = TestBed.createComponent(EscalationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
