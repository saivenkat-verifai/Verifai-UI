import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, concat } from "rxjs";
import { catchError, delay } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private baseUrl =
    "https://stagingmq.ivisecurity.com/queueManagement/getEventDashboardCounts_1_0";

  constructor(private http: HttpClient) {}

  getEventCountsByRange(
    startDate: Date,
    startTime: string,
    endDate: Date,
    endTime: string
  ): Observable<any> {
    const fromDate = `${this.formatDate(startDate)} ${startTime}`;
    const toDate = `${this.formatDate(endDate)} ${endTime}`;
    // const apiUrl = `${this.baseUrl}?fromDate=${fromDate}&toDate=${toDate}`;
    const apiUrl = `${this.baseUrl}?`;

    const defaultData = {
      totalEvents: { total: 0, totalPercentage: 0, eventWall: 0, manualWall: 0, sitesCount: 0, cameraCount: 0 },
      false: { total: 0, falsePercentage: 0, eventWall: 0, manualWall: 0, sitesCount: 0, cameraCount: 0 },
      missedWall: { total: 0, missedWallPercentage: 0, eventWall: 0, manualWall: 0, sitesCount: 0, cameraCount: 0 },
      suspicious: {
        total: 0,
        suspiciousPercentage: 0,
        eventWall: 0,
        manualWall: 0,
        sitesCount: 0,
        cameraCount: 0,
        details: {
          escalated: { total: 0, eventWall: 0, manualWall: 0, sitesCount: 0, cameraCount: 0,  "hourlyBreakdown": {
          "HourlyManualWall":[1,3,58,98,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330 ],
          "HourlyEventWall":[1,3,58,98,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260,270,280,290,300,310,320,330]
        } },
          arrest: { total: 0, eventWall: 0, manualWall: 0, sitesCount: 0, cameraCount: 0, hourlyBreakdown: { HourlyManualWall: Array(24).fill(0), HourlyEventWall: Array(24).fill(0) } },
          deterred: { total: 0, eventWall: 0, manualWall: 0, sitesCount: 0, cameraCount: 0, hourlyBreakdown: { HourlyManualWall: Array(24).fill(0), HourlyEventWall: Array(24).fill(0) } },
          information: { total: 0, eventWall: 0, manualWall: 0, sitesCount: 0, cameraCount: 0, hourlyBreakdown: { HourlyManualWall: Array(24).fill(0), HourlyEventWall: Array(24).fill(0) } },
          intervention: { total: 0, eventWall: 0, manualWall: 0, sitesCount: 0, cameraCount: 0, hourlyBreakdown: { HourlyManualWall: Array(24).fill(0), HourlyEventWall: Array(24).fill(0) } },
          missedEvent: { total: 0, eventWall: 0, manualWall: 0, sitesCount: 0, cameraCount: 0, hourlyBreakdown: { HourlyManualWall: Array(24).fill(0), HourlyEventWall: Array(24).fill(0) } },
        },
      },
      pending: { total: 0, pendingPercentage: 0, eventWall: 0, manualWall: 0, sitesCount: 0, cameraCount: 0 },
    };

    const apiRequest$ = this.http.get<any>(apiUrl).pipe(
      catchError((error) => {
        console.error("API error, returning default data:", error);
        return of(defaultData);
      })
    );

    // Emit default data immediately, then API data
    return concat(of(defaultData), apiRequest$);
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = ("0" + (date.getMonth() + 1)).slice(-2);
    const d = ("0" + date.getDate()).slice(-2);
    return `${y}-${m}-${d}`;
  }
}
