import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Teams } from '../../../shared/modales';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/teams`;


  getTeams(): Observable<Teams[]> {
    return this.http.get<Teams[]>(this.API_URL);
  }


  createTeam(name: string): Observable<Teams> {
    return this.http.post<Teams>(this.API_URL, { name });
  }


  addMember(teamId: number, userId: number, role: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${teamId}/members`, { userId, role });
  }

  deleteTeam(teamId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${teamId}`);
  }

  removeMember(teamId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${teamId}/members/${userId}`);
  }

  getTeamMembers(teamId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/${teamId}/members`);
  }

}
