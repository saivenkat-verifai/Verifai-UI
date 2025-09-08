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
  @Input() chartMode: 'solarEmployment' | 'otherMode' = 'solarEmployment';

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  private categories = [
    '1', '2', '3', '4', '5', '6', 
    '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', 
  ];

  private solarEmploymentSeries: Highcharts.SeriesOptionsType[] = [
     {
    name: 'Missed',
    type: 'line',
    data: [1500, 1200, 530, 110, 55, 55, 25, 40, 60, 70, 90, 110, 130, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340],
  },
  {
    name: 'Suspecious',
    type: 'line',
    data: [200, 200, 30, 10, 5, 5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155, 165, 175, 185],
  },
  {
    name: 'Deterred',
    type: 'line',
    data: [0, 0, 0, 0, 0, 200, 30, 10, 5, 5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145],
  },
  {
    name: 'Intervention',
    type: 'line',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 400, 300, 10, 5, 5, 15, 25, 35, 45, 55, 65, 75, 85, 95],
  },
  {
    name: 'Arrest',
    type: 'line',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 30, 10, 5, 5, 15, 25, 35, 45],
  },
  {
    name: 'Information',
    type: 'line',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 300, 100, 50, 50, 60, 70, 80, 90, 100],
  },
  ];

  private otherSeries: Highcharts.SeriesOptionsType[] = [
    // Define other chart series for 'otherMode' if needed
  ];

  ngOnChanges(changes: SimpleChanges): void {
    let title = '';
    let series: Highcharts.SeriesOptionsType[] = [];

    if (this.chartMode === 'solarEmployment') {
      title = 'Time graph';
      series = this.solarEmploymentSeries;
    } else if (this.chartMode === 'otherMode') {
      title = 'Other Line Chart';
      series = this.otherSeries;
    }

    this.chartOptions = {
      chart: {
        type: 'line',
      },
      title: {
        text: title,
        align: 'left',
      },
      subtitle: {
        text: '',
        align: 'left',
      },
      xAxis: {
        categories: this.categories,
        accessibility: {
          description: 'Range: 2010 to 2022',
        },
      },
      yAxis: {
        title: {
          text: '',
        },
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
          pointStart: 0,
        },
      },
      series: series,
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
              },
            },
          },
        ],
      },
    };
  }
}
