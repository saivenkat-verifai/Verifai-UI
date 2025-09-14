import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  private apiGroups = 'https://usstaging.ivisecurity.com/events_data/getGroupDetails';
  private apiSitesAndUsers = 'https://usstaging.ivisecurity.com/events_data/getGroupSitesAndGroupUsers_1_0';

  constructor(private http: HttpClient) {}

  // First API: Get all groups
  getGroups(): Observable<any> {
    return this.http.get<any>(this.apiGroups);
  }

  // Second API: Get sites and users for a group
  getGroupSitesAndUsers(groupId: number): Observable<any> {
    return this.http.get<any>(`${this.apiSitesAndUsers}?groupId=${groupId}`);
    console.log("Group ID:", groupId); // Debugging line to check groupId value
  }
}
