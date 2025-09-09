import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'https://stagingmq.ivisecurity.com/queueManagement/getEventCounts_1_0';

  constructor(private http: HttpClient) {}

  getEventCounts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
