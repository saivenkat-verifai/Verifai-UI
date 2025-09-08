import { Component, OnInit } from '@angular/core';
import { ESCALATED_COLORS } from 'src/app/shared/constants/chart-colors';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ColumnChartComponent } from '../../shared/column-chart/column-chart.component';
import { LineChartComponent } from '../../shared/line-chart/line-chart.component';


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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
   standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    UpperCasePipe,
    MatDatepickerModule,
    MatNativeDateModule,
    ColumnChartComponent,
    LineChartComponent,
    // other imports...
  ],
})
export class DashboardComponent implements OnInit {
  currentDate: Date = new Date(); // Initialize with today's date
  totalEvents = 37000;
  falseEvents = 33250;
  escalated = 1750;
  pending = 2000;
  missed = 1500;

  dashboardCards: DashboardCard[] = [
    {
      title: 'Total Events',
      value: this.totalEvents,
      color: 'red',
       colordot: [
        { iconcolor: '#FFC400', count: 366470 },
        { iconcolor: '#53BF8B', count: 360 },
      ],
      icons: [
        { iconPath: 'assets/home.svg', count: 300 },
        { iconPath: 'assets/cam.svg', count: 1500 },
      ],
    },
    {
      title: 'False',
      value: this.falseEvents,
      percentage: 88,
      color: 'white',
     colordot: [
        { iconcolor: '#FFC400', count: 33000 },
        { iconcolor: '#53BF8B', count: 250 },
      ],
      icons: [
        { iconPath: 'assets/home.svg', count: 300 },
        { iconPath: 'assets/cam.svg', count: 1500 },
      ],
    },
    {
      title: 'Escalated',
      value: this.escalated,
      percentage: 5,
      color: 'white',
      colordot: [
        { iconcolor: '#FFC400', count: 1700 },
        { iconcolor: '#53BF8B', count: 50 },
      ],
      icons: [
        { iconPath: 'assets/home.svg', count: 150 },
        { iconPath: 'assets/cam.svg', count: 750 },
      ],
    },
    {
      title: 'Pending',
      value: this.pending,
      percentage: 7,
      color: 'white',
      colordot: [
        { iconcolor: '#FFC400', count: 1950 },
        { iconcolor: '#53BF8B', count: 50 },
      ],
      icons: [
        { iconPath: 'assets/home.svg', count: 150 },
        { iconPath: 'assets/cam.svg', count: 750 },
      ],
    },
    {
      title: 'Missed Well',
      value: this.missed,
      percentage: 7,
      color: 'white',
       colordot: [
        { iconcolor: '#FFC400', count: 490 },
        { iconcolor: '#53BF8B', count: 10 },
      ],
      icons: [
        { iconPath: 'assets/home.svg', count: 20 },
        { iconPath: 'assets/cam.svg', count: 100 },
      ],
    },
  ];

  escalatedDetails: EscalatedDetail[] = [
    {
      label: 'Missed',
      value: 1500,
      color: ESCALATED_COLORS[0],
      colordot: [
        { iconcolor: '#FFC400', count: 1590 },
        { iconcolor: '#53BF8B', count: 10 },
      ],
      icons: [
        { iconPath: 'assets/home.svg', count: 150 },
        { iconPath: 'assets/cam.svg', count: 750 },
      ],
    },
    {
      label: 'Suspicious',
      value: 200,
      color: ESCALATED_COLORS[1],
      colordot: [
        { iconcolor: '#FFC400', count: 200 },
        { iconcolor: '#53BF8B', count: 0 },
      ],
      icons: [
        { iconPath: 'assets/home.svg', count: 150 },
        { iconPath: 'assets/cam.svg', count: 750 },
      ],
    },
    {
      label: 'Deterred',
      value: 30,
      color: ESCALATED_COLORS[2],
      colordot: [
        { iconcolor: '#FFC400', count: 30 },
        { iconcolor: '#53BF8B', count: 0 },
      ],
      icons: [
        { iconPath: 'assets/home.svg', count: 150 },
        { iconPath: 'assets/cam.svg', count: 750 },
      ],
    },
    {
      label: 'Intervention',
      value: 10,
      color: ESCALATED_COLORS[3],
      colordot: [
        { iconcolor: '#FFC400', count: 10 },
        { iconcolor: '#53BF8B', count: 0 },
      ],
      icons: [
        { iconPath: 'assets/home.svg', count: 150 },
        { iconPath: 'assets/cam.svg', count: 750 },
      ],
    },
    {
      label: 'Arrest',
      value: 6,
      color: ESCALATED_COLORS[4],
      colordot: [
        { iconcolor: '#FFC400', count: 4 },
        { iconcolor: '#53BF8B', count: 1 },
      ],
      icons: [
        { iconPath: 'assets/home.svg', count: 150 },
        { iconPath: 'assets/cam.svg', count: 750 },
      ],
    },
    {
      label: 'Information',
      value: 5,
      color: ESCALATED_COLORS[5],
      colordot: [
        { iconcolor: '#FFC400', count: 5 },
        { iconcolor: '#53BF8B', count: 0 },
      ],
      icons: [
        { iconPath: 'assets/home.svg', count: 150 },
        { iconPath: 'assets/cam.svg', count: 750 },
      ],
    },
  ];

  escalatedGraph = [
    { label: 'Missed', value: 1500, height: 85 },
    { label: 'Suspicious', value: 200, height: 45 },
    { label: 'Deterred', value: 30, height: 20 },
    { label: 'Intervention', value: 10, height: 10 },
    { label: 'Arrest', value: 5, height: 5 },
    { label: 'Information', value: 5, height: 5 },
  ];

  compareGraph = [
    { label: 'Missed', current: 1500, previous: 1150 },
    { label: 'Suspicious', current: 200, previous: 450 },
    { label: 'Deterred', current: 30, previous: 60 },
    { label: 'Intervention', current: 10, previous: 30 },
    { label: 'Arrest', current: 5, previous: 5 },
    { label: 'Information', current: 5, previous: 5 },
  ];

  getCircleGradient(percent: number): string {
    const deg = percent * 3.6; // % to degrees
    return `conic-gradient(#e53935 ${deg}deg, #fce4ec 0deg)`;
  }

  selectedFilter: string = 'DAY';
  isCalendarPopupOpen = false;
  selectedDate: Date | null = null;

  ngOnInit() {
    this.selectedDate = new Date(); // Default to today
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
