import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ESCALATED_COLORS } from 'src/app/shared/constants/chart-colors';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule
    , HighchartsChartModule
  ],
})
export class ColumnChartComponent implements OnChanges {
  @Input() chartMode: 'escalated' | 'compare' = 'escalated';

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  private categories = ['Misd', 'Susp', 'Detr', 'Inte', 'arst', 'Info'];

  private escalatedSeries: Highcharts.SeriesOptionsType[] = [
  {
    name: 'escalated',
    type: 'column',
    data: [
      { y: 1500, color: ESCALATED_COLORS[0] },
      { y: 200, color: ESCALATED_COLORS[1] },
      { y: 30, color: ESCALATED_COLORS[2] },
      { y: 10, color: ESCALATED_COLORS[3] },
      { y: 6, color: ESCALATED_COLORS[4] },
      { y: 5, color: ESCALATED_COLORS[5] },
    ],
  },
];
 
  private compareSeries: Highcharts.SeriesOptionsType[] = [
    {
      name: 'escalated',
      type: 'column',
      data: [
        { y: 1500, color: '#33b77a' },
        { y: 200, color: '#1f77c0' },
        { y: 30, color: '#a97ff4' },
        { y: 10, color: '#f4cb57' },
        { y: 6, color: '#c63d5e' },
        { y: 5, color: '#677381' },
      ],
    },
    {
      name: 'compare',
      type: 'column',
      data: [
        { y: 1150, color: '#000' },
        { y: 450, color: '#000' },
        { y: 60, color: '#000' },
        { y: 30, color: '#000' },
        { y: 0, color: '#000' },
        { y: 0, color: '#000' },
      ],
    },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    let title = '';
    let series: Highcharts.SeriesOptionsType[] = [];

    if (this.chartMode === 'escalated') {
      title = 'ESCALATED Graph';
      series = this.escalatedSeries;
    } else if (this.chartMode === 'compare') {
      title = 'Compare Graph';
      series = this.compareSeries;
    }

    this.chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: title,
      },
      xAxis: {
        categories: this.categories,
        crosshair: true,
        accessibility: {
          description: 'Categories',
        },
      },
      yAxis: {
        min: 0,
        title: { text: '' },
      },
      plotOptions: {
        column: {
          borderRadius: 10,
          pointPadding: 0.2,
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            style: {
              fontWeight: 'bold',
              color: 'black',
            },
          },
        },
      },
      series: series,
    };
  }
}
