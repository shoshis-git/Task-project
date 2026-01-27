import { inject, Injectable } from '@angular/core';
import { Projects } from '../../../shared/modales';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ServiceProject {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/projects`;

  // קבלת כל הפרויקטים (מוגן)
  getProjects(): Observable<Projects[]> {
    return this.http.get<Projects[]>(this.API_URL);
  }

  // יצירת פרויקט חדש (POST /api/projects)
  createProject(projectData: { teamId: number; name: string; description: string }): Observable<Projects> {
    return this.http.post<Projects>(this.API_URL, projectData);
  }
}
