import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnChartComponent } from './column-chart.component';

describe('ColumnChartComponent', () => {
  let component: ColumnChartComponent;
  let fixture: ComponentFixture<ColumnChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColumnChartComponent]
    });
    fixture = TestBed.createComponent(ColumnChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
