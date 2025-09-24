import { Component, OnInit } from "@angular/core";
import { CommonModule, UpperCasePipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { CardModule } from "primeng/card";
import { DashboardService } from "./dashboard.service";
import { CalendarComponent } from "src/app/shared/calendar/calendar.component";
import { ColumnChartComponent } from "../../shared/column-chart/column-chart.component";
import { LineChartComponent } from "src/app/shared/line-chart/line-chart.component";
import { ESCALATED_COLORS } from "src/app/shared/constants/chart-colors";

interface CardDot {
  iconcolor: string;
  count: number;
}
interface DashboardCard {
  title: string;
  value: number;
  percentage?: number;
  color: string;
  icons: { iconPath: string; count: number }[];
  colordot: CardDot[];
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    CardModule,
    ColumnChartComponent,
    CalendarComponent,
    LineChartComponent,
  ],
})
export class DashboardComponent implements OnInit {
  currentDate = new Date();
  isLoading = false;

  dashboardCards: DashboardCard[] = [];
  escalatedDetails: any[] = [];
  escalatedGraph: any[] = [];
  compareGraph: any[] = [];
  hourlyBreakdownData: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    const now = new Date();
  }

  getCircleGradient(percent: number): string {
    const deg = percent * 3.6;
    return `conic-gradient(#e53935 ${deg}deg, #fce4ec 0deg)`;
  }

  onDateRangeSelected(event: {
    startDate: Date;
    startTime: string;
    endDate: Date;
    endTime: string;
  }) {
    this.isLoading = true;
    this.dashboardService
      .getEventCountsByRange(
        event.startDate,
        event.startTime,
        event.endDate,
        event.endTime
      )
      .subscribe({
        next: (data) => {
          if (!data) return;
          this.dashboardCards = this.mapCards(data);
          this.escalatedDetails = this.mapDetails(data.suspicious.details);
          this.escalatedGraph = this.mapGraph(data.suspicious.details);
          this.compareGraph = this.mapCompareGraph(data.suspicious.details);
          this.hourlyBreakdownData = this.mapHourly(data.suspicious.details);
        },
        error: (err) => console.error(err),
       complete: () => {
  setTimeout(() => {
    this.isLoading = false;
  });
}
      });
  }

  private mapCards(data: any): DashboardCard[] {
    const formatTitle = (key: string) => {
      return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
    };
    const config = Object.keys(data).map((key) => {
      const value = data[key as keyof typeof data];
      const percKey = Object.keys(value).find((k) =>
        k.toLowerCase().includes("percentage")
      );
      return {
        key,
        title: formatTitle(key),
        color: key === "totalEvents" ? "red" : "white",
        perc:
          percKey && key !== "totalEvents"
            ? value[percKey as keyof typeof value]
            : undefined,
      };
    });
    return config.map((c) => {
      const item = data[c.key];
      return {
        title: c.title,
        value: item.total,
        percentage: c.perc,
        color: c.color,
        colordot: [
          { iconcolor: "#FFC400", count: item.eventWall },
          { iconcolor: "#53BF8B", count: item.manualWall },
        ],
        icons: [
          { iconPath: "assets/home.svg", count: item.sitesCount },
          { iconPath: "assets/cam.svg", count: item.cameraCount },
        ],
      };
    });
  }

  private mapDetails(details: any) {
    return Object.keys(details).map((k, i) => ({
      label: k.charAt(0).toUpperCase() + k.slice(1),
      value: details[k].total,
      color: ESCALATED_COLORS[i] || "#000",
      colordot: [
        { iconcolor: "#FFC400", count: details[k].eventWall },
        { iconcolor: "#53BF8B", count: details[k].manualWall },
      ],
      icons: [
        { iconPath: "assets/home.svg", count: details[k].sitesCount },
        { iconPath: "assets/cam.svg", count: details[k].cameraCount },
      ],
    }));
  }

  private mapGraph(details: any) {
    return Object.keys(details).map((k) => ({
      label: k,
      value: details[k].total,
      height: details[k].total,
    }));
  }

  private mapCompareGraph(details: any) {
    return Object.keys(details).map((k) => ({
      label: k,
      current: details[k].total,
      previous: Math.floor(details[k].total * 0.8),
    }));
  }

  private mapHourly(details: any) {
    const series: any[] = [];
    Object.keys(details).forEach((k) => {
      const d = details[k];
      series.push({
        name: `${k} - Event Wall`,
        type: "line",
        data: d.hourlyBreakdown.HourlyEventWall,
      });
      series.push({
        name: `${k} - Manual Wall`,
        type: "line",
        data: d.hourlyBreakdown.HourlyManualWall,
      });
    });
    return series;
  }
}
