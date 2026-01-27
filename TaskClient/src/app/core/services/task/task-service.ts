import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Tasks } from '../../../shared/modales';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/tasks`;

  // שליפת משימות עם מסנן projectId
  getTasks(projectId: number): Observable<Tasks[]> {
    const params = new HttpParams().set('projectId', projectId.toString());
    return this.http.get<Tasks[]>(this.API_URL, { params });
  }

  // יצירת משימה חדשה
  createTask(task:{projectId: number; title: string}): Observable<Tasks> {
    return this.http.post<Tasks>(this.API_URL, task);
  }

  // עדכון משימה (סטטוס, תיאור וכו')
  updateTask(id: number, updates: { status?: string; priority?: string }): Observable<Tasks> {
    return this.http.patch<Tasks>(`${this.API_URL}/${id}`, updates);
  }

  // מחיקת משימה
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
