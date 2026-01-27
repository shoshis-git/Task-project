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

  // קבלת כל הצוותים (GET /api/teams)
  getTeams(): Observable<Teams[]> {
    return this.http.get<Teams[]>(this.API_URL);
  }

  // יצירת צוות חדש (POST /api/teams)
  createTeam(name: string): Observable<Teams> {
    return this.http.post<Teams>(this.API_URL, { name });
  }

  // הוספת חבר לצוות (POST /api/teams/:teamId/members)
  addMember(teamId: number, userId: number,role: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${teamId}/members`, { userId, role });
  }
}
