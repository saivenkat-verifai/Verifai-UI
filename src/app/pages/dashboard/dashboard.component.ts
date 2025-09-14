import { Component, OnInit } from "@angular/core";
import { ESCALATED_COLORS } from "src/app/shared/constants/chart-colors";
import { CommonModule, DatePipe, UpperCasePipe } from "@angular/common";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ColumnChartComponent } from "../../shared/column-chart/column-chart.component";
import { LineChartComponent } from "../../shared/line-chart/line-chart.component";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { DashboardService } from "./dashboard.service";

interface IconData {
  iconPath: string;
  count: number;
}

interface CardIcon {
  iconPath: string;
  count: number;
}

interface CardDot {
  iconcolor: string;
  count: number;
}

interface DashboardCard {
  title: string;
  value: number;
  percentage?: number; // optional for circle chart
  color: string; // 'red' or 'white'
  labelColor?: string; // for label text color if needed
  icons: CardIcon[];
  colordot: CardDot[];
}

interface EscalatedDetail {
  label: string;
  value: number;
  icons: IconData[];
  colordot?: CardDot[];
  color: string;
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    UpperCasePipe,
    MatDatepickerModule,
    MatNativeDateModule,
    ColumnChartComponent,
    // LineChartComponent,
    HttpClientModule,
  ],
})
export class DashboardComponent implements OnInit {
  currentDate: Date = new Date();
  selectedFilter: string = "DAY";
  isCalendarPopupOpen = false;
  selectedDate: Date | null = null;

  dashboardCards: DashboardCard[] = [];
  escalatedDetails: EscalatedDetail[] = [];
  escalatedGraph: any[] = [];
  compareGraph: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.selectedDate = new Date();
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.dashboardService.getEventCounts().subscribe((response) => {
      this.mapDashboardCards(response);
      this.mapEscalatedDetails(response.escalated.details);
      this.mapGraphs(response.escalated.details);
    });
  }

  
  mapDashboardCards(data: any) {
    this.dashboardCards = [
      {
        title: "Total Events",
        value: data.totalEvents.total,
        color: "red",
        colordot: [
          { iconcolor: "#FFC400", count: data.totalEvents.eventWall },
          { iconcolor: "#53BF8B", count: data.totalEvents.manualWall },
        ],
        icons: [
          { iconPath: "assets/home.svg", count: data.totalEvents.sitesCount },
          { iconPath: "assets/cam.svg", count: data.totalEvents.cameraCount },
        ],
      },
      {
        title: "False",
        value: data.false.total,
        percentage: data.false.falsePercentage,
        color: "white",
        colordot: [
          { iconcolor: "#FFC400", count: data.false.eventWall },
          { iconcolor: "#53BF8B", count: data.false.manualWall },
        ],
        icons: [
          { iconPath: "assets/home.svg", count: data.false.sitesCount },
          { iconPath: "assets/cam.svg", count: data.false.cameraCount },
        ],
      },
       {
        title: "Suspicious",
        value: data.suspicious.total,
        percentage: data.suspicious.suspiciousPercentage,
        color: "white",
        colordot: [
          { iconcolor: "#FFC400", count: data.suspicious.eventWall },
          { iconcolor: "#53BF8B", count: data.suspicious.manualWall },
        ],
        icons: [
          { iconPath: "assets/home.svg", count: data.suspicious.sitesCount },
          { iconPath: "assets/cam.svg", count: data.suspicious.cameraCount },
        ],
      },
      {
        title: "escalated",
        value: data.escalated.total,
        percentage: data.escalated.escalatedPercentage,
        color: "white",
        colordot: [
          {
            iconcolor: "#FFC400",
            count: Object.values(data.escalated.details).reduce(
              (sum: number, d: any) => sum + d.eventWall,
              0
            ),
          },
          {
            iconcolor: "#53BF8B",
            count: Object.values(data.escalated.details).reduce(
              (sum: number, d: any) => sum + d.manualWall,
              0
            ),
          },
        ],
        icons: [
          {
            iconPath: "assets/home.svg",
            count: Object.values(data.escalated.details).reduce(
              (sum: number, d: any) => sum + d.sitesCount,
              0
            ),
          },
          {
            iconPath: "assets/cam.svg",
            count: Object.values(data.escalated.details).reduce(
              (sum: number, d: any) => sum + d.cameraCount,
              0
            ),
          },
        ],
      },
      {
        title: "Pending",
        value: data.pending,
        percentage: data.pendingPercentage,
        color: "white",
        colordot: [
          { iconcolor: "#FFC400", count: data.eventWall },
          { iconcolor: "#53BF8B", count: data.manualWall },
        ],
        icons: [
          { iconPath: "assets/home.svg", count: data.sitesCount },
          { iconPath: "assets/cam.svg", count: data.camerasCount },
        ],
      },
      {
        title: "Missed Wall",
        value: data.missedWall.total,
        percentage: data.missedWall.missedWallPercentage,
        color: "white",
        colordot: [
          { iconcolor: "#FFC400", count: data.missedWall.eventWall },
          { iconcolor: "#53BF8B", count: data.missedWall.manualWall },
        ],
        icons: [
          { iconPath: "assets/home.svg", count: data.missedWall.sitesCount },
          { iconPath: "assets/cam.svg", count: data.missedWall.cameraCount },
        ],
      },
    ];
  }

  mapEscalatedDetails(details: any) {
    this.escalatedDetails = Object.keys(details).map((key, index) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value: details[key].total,
      color: ESCALATED_COLORS[index] || "#000",
      colordot: [
        { iconcolor: "#FFC400", count: details[key].eventWall },
        { iconcolor: "#53BF8B", count: details[key].manualWall },
      ],
      icons: [
        { iconPath: "assets/home.svg", count: details[key].sitesCount },
        { iconPath: "assets/cam.svg", count: details[key].cameraCount },
      ],
    }));
  }

  mapGraphs(details: any) {
    this.escalatedGraph = Object.keys(details).map((key) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value: details[key].total,
      height: details[key].total, // optional: scale later for UI
    }));

    // Example compareGraph (you can adjust previous values if needed)
    this.compareGraph = Object.keys(details).map((key) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      current: details[key].total,
      previous: Math.floor(details[key].total * 0.8), // dummy previous value
    }));
  }

  getCircleGradient(percent: number): string {
    const deg = percent * 3.6;
    return `conic-gradient(#e53935 ${deg}deg, #fce4ec 0deg)`;
  }

  setFilter(filter: string): void {
    this.selectedFilter = filter;
  }

  changeDate(offset: number) {
    if (this.selectedDate) {
      const updatedDate = new Date(this.selectedDate);
      updatedDate.setDate(updatedDate.getDate() + offset);
      this.selectedDate = updatedDate;
    }
  }

  setToday(): void {
    this.currentDate = new Date();
    this.selectedDate = this.currentDate;
  }

  onDateSelected(date: Date) {
    this.selectedDate = date;
    this.closeCalendarPopup();
  }

  openCalendar(): void {
    this.openCalendarPopup();
  }

  openCalendarPopup() {
    this.isCalendarPopupOpen = true;
  }

  closeCalendarPopup() {
    this.isCalendarPopupOpen = false;
  }
}
