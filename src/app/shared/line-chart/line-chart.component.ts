import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  standalone: true,
  imports: [HighchartsChartModule],
})
export class LineChartComponent implements OnChanges {
  @Input() chartMode: 'suspiciousHourlyData' | 'otherMode' = 'suspiciousHourlyData';
  @Input() hourlyData: any; // Array of Highcharts.SeriesOptionsType from dashboard

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  private categories = Array.from({ length: 24 }, (_, i) => `${i + 1}:00`);

  ngOnChanges(changes: SimpleChanges): void {
    if (this.hourlyData && this.hourlyData.length > 0) {
      this.updateChartWithHourlyData();
    } else {
      this.setDefaultChart();
    }
  }

  private updateChartWithHourlyData() {
    this.chartOptions = {
      chart: { type: 'line' },
      title: { text: 'Suspicious Events Hourly Breakdown', align: 'center' },
      xAxis: { categories: this.categories },
      yAxis: { title: { text: 'Count' } },
      legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle' },
      plotOptions: { series: { label: { connectorAllowed: false }, pointStart: 0 } },
      series: this.hourlyData,
      responsive: {
        rules: [
          {
            condition: { maxWidth: 500 },
            chartOptions: {
              legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom' },
            },
          },
        ],
      },
    };
  }

  private setDefaultChart() {
    this.chartOptions = {
      chart: { type: 'line' },
      title: { text: 'No Data', align: 'left' },
      xAxis: { categories: this.categories },
      yAxis: { title: { text: 'Count' } },
      series: [],
    };
  }
}
