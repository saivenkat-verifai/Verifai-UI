import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private eventReportFullData = 'https://usstaging.ivisecurity.com/events_data/getEventReportFullData_1_0';
  private actionTagCategoriesUrl = 'https://usstaging.ivisecurity.com/events_data/getActionTagCategories_1_0';
  private pendingMessagesUrl = 'https://stagingmq.ivisecurity.com/queueManagement/getEventsPendingMessages_1_0?level=1';
  private eventReportCountsForActionTag = 'https://usstaging.ivisecurity.com/events_data/getEventReportCountsForActionTag_1_0';

  constructor(private http: HttpClient) {}

  getSuspiciousEvents(suspiciousChecked: any): Observable<any> {
    // Send suspiciousChecked as a query parameter
    return this.http.get<any>(`${this.eventReportFullData}?suspiciousChecked=${suspiciousChecked}`);
  }

  getEventsPendingEventa(): Observable<any> {
    // Replace with the correct API endpoint if needed
    return this.http.get<any>(`${this.pendingMessagesUrl}`);
  }
  getActionTagCategories(): Observable<any> {
    return this.http.get<any>(this.actionTagCategoriesUrl);
  }

getEventReportCountsForActionTag(date: string, actionTag: number): Observable<any> {
  const url = `${this.eventReportCountsForActionTag}?date=${date}&actionTag=${actionTag}`;
  return this.http.get<any>(url);
}

}
