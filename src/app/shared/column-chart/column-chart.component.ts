import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from "@angular/core";
import * as Highcharts from "highcharts";
import { HighchartsChartModule } from "highcharts-angular";
import { CommonModule } from "@angular/common";
import { ESCALATED_COLORS } from "src/app/shared/constants/chart-colors";

@Component({
  selector: "app-column-chart",
  templateUrl: "./column-chart.component.html",
  styleUrls: ["./column-chart.component.css"],
  standalone: true,
  imports: [
    CommonModule, // ✅ for *ngIf
    HighchartsChartModule, // ✅ so <highcharts-chart> works
  ],
})
export class ColumnChartComponent implements OnChanges, AfterViewInit {
  @Input() chartMode: string = "";
  @Input() chartData: any[] = [];
  @Input() compareData: any[] = [];

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  chartRendered = false;

  ngAfterViewInit(): void {
    if (this.chartData?.length) {
      this.renderChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes["chartData"] && !changes["chartData"].firstChange) ||
      (changes["compareData"] && !changes["compareData"].firstChange)
    ) {
      this.renderChart();
    }
  }

  private renderChart(): void {
    if (!this.chartData || this.chartData.length === 0) {
      this.chartRendered = false;
      return;
    }

    if (this.compareData && this.compareData.length > 0) {
      this.chartOptions = {
        chart: { type: "column" },
        title: { text: 'Suspicious Events', align: 'center' },
        xAxis: { categories: this.compareData.map((d) => d.label) },
        yAxis: { title: { text: "Count" } },
        plotOptions: {
          column: { borderRadius: 25 },
        },
        series: [
          {
            type: "column",
            name: "Current",
            data: this.compareData.map((d, i) => ({
              y: d.current,
              color: ESCALATED_COLORS[i % ESCALATED_COLORS.length],
            })),
          },
          { 
            type: "column",
            name: "Previous",
            data: this.compareData.map((d, i) => ({
              y: d.previous,
              color: ESCALATED_COLORS[i % ESCALATED_COLORS.length],
            })),
          },
        ],
      };
    } else {
      this.chartOptions = {
        chart: { type: "column" },
         title: { text: 'Suspicious Events', align: 'center' },
        xAxis: { categories: this.chartData.map((d) => d.label) },
        yAxis: { title: { text: "Count" } },
        plotOptions: {
          column: { borderRadius: 25 , pointWidth: 25, },
        },
        series: [
          {
            type: "column",
            name: this.chartMode,
            data: this.chartData.map((d, i) => ({
              y: d.value,
              color: ESCALATED_COLORS[i % ESCALATED_COLORS.length],
            })),
          },
        ],
      };
    }

    this.chartRendered = true;
  }
}
