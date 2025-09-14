import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private apiUrl = 'https://usstaging.ivisecurity.com/events_data/getEventReportFullData_1_0';

  constructor(private http: HttpClient) {}

  getSuspiciousEvents(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
