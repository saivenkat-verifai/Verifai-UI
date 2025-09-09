import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private apiUrl = 'http://usstaging.ivisecurity.com:8234/getEventReportFullData_1_0?actionTag=Suspicious';

  constructor(private http: HttpClient) {}

  getSuspiciousEvents(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}