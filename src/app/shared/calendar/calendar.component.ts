

import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  @Output() dateRangeSelected = new EventEmitter<{ startDate: Date, startTime: string, endDate: Date, endTime: string }>();

  viewMode: 'day' | 'week' | 'month' | 'custom' = 'day';
  currentMonth: Date = new Date();
  today: Date = new Date();
  showPopup: boolean = false;

  startDate: Date = new Date();
  endDate: Date = new Date();

  startValue: string = '';
  endValue: string = '';
  daterange: boolean = true;
  wholeDay: boolean = false;

  startTime: string = '00:00';
  endTime: string = '';

  // ngOnInit() {
  //   this.setTodayStartEndValues();
  //   const now = new Date();
  //   this.startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0);
  //   this.endDate = now;
  //   this.startTime = '00:00';
  //   this.endTime = `${now.getHours().toString().padStart(2, '0')}:${now
  //     .getMinutes()
  //     .toString()
  //     .padStart(2, '0')}`;
  // }
  ngOnInit() {
  this.setTodayStartEndValues();
  const now = new Date();
  this.startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0);
  this.endDate = now;
  this.startTime = '00:00';
  this.endTime = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

  // Emit default range to dashboard
  this.dateRangeSelected.emit({
    startDate: this.startDate,
    startTime: this.startTime,
    endDate: this.endDate,
    endTime: this.endTime
  });
}

  toggleDateRange() {
    if (this.daterange) {
      this.wholeDay = false;
    }
    this.setTodayStartEndValues();
  }

  toggleWholeDay() {
    if (this.wholeDay) {
      this.daterange = false;
    }
    this.setTodayStartEndValues();
  }

  setTodayStartEndValues() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0);

    this.startValue = this.wholeDay
      ? this.formatLocalDate(todayStart)
      : this.formatLocalDateTime(todayStart);

    this.endValue = this.wholeDay
      ? this.formatLocalDate(now)
      : this.formatLocalDateTime(now);
  }

  togglePopup() {
    this.showPopup = !this.showPopup;

    if (this.showPopup) {
      this.setTodayStartEndValues();
    }
  }

  confirmSelection() {
    if (this.startValue) {
      const start = new Date(this.startValue);
      this.startDate = start;
      this.startTime = this.wholeDay
        ? '00:00'
        : `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`;
    }

    if (this.endValue) {
      const end = new Date(this.endValue);
      this.endDate = end;
      this.endTime = this.wholeDay
        ? '23:59'
        : `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
    }

    this.dateRangeSelected.emit({
      startDate: this.startDate,
      startTime: this.startTime,
      endDate: this.endDate,
      endTime: this.endTime
    });

    this.showPopup = false;
  }

  get daysInMonth(): { date: Date | null, isFuture: boolean }[] {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();

    const calendar: { date: Date | null, isFuture: boolean }[] = [];

    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      calendar.push({ date: null, isFuture: false });
    }

    for (let d = 1; d <= days; d++) {
      const date = new Date(year, month, d);
      calendar.push({ date, isFuture: date > this.today });
    }

    return calendar;
  }

  prevMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
  }

goToday() {
  const now = new Date();
  this.currentMonth = now;

  // Start of the day
  this.startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0);
  this.endDate = now;

  // Update start and end times
  this.startTime = '00:00';
  this.endTime = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

  // Update input values
  this.setTodayStartEndValues();

  // Emit updated date range to dashboard
  this.dateRangeSelected.emit({
    startDate: this.startDate,
    startTime: this.startTime,
    endDate: this.endDate,
    endTime: this.endTime
  });
}

  selectDate(date: Date) {
    if (!this.startDate || (this.startDate && this.endDate)) {
      this.startDate = date;
      this.endDate = null as any;
    } else {
      if (date >= this.startDate) {
        this.endDate = date;
      } else {
        this.endDate = this.startDate;
        this.startDate = date;
      }
    }
  }

  isSelected(date: Date | null): boolean {
    if (!date) return false;
    if (this.startDate && !this.endDate) {
      return date.toDateString() === this.startDate.toDateString();
    }
    if (this.startDate && this.endDate) {
      return date >= this.startDate && date <= this.endDate;
    }
    return false;
  }

  formatLocalDateTime(date: Date) {
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    const hh = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  formatLocalDate(date: Date) {
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  get todayDate(): string {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}`;
  }

  get todayStart(): string {
    return '00:00';
  }

  get nowTime(): string {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }
}

