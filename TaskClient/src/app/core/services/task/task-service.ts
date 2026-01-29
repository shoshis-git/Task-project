import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { Tasks } from '../../../shared/modales';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/tasks`;

  // הסיגנל המרכזי שמחזיק את כל המשימות של הפרויקט הנוכחי
  private tasksSignal = signal<Tasks[]>([]);

  // סיגנלים מחושבים (Computed) שמפלטרים את המשימות אוטומטית לפי סטטוס
  todoTasks = computed(() => this.tasksSignal().filter(t => t.status === 'todo'));
  inProgressTasks = computed(() => this.tasksSignal().filter(t => t.status === 'in-progress'));
  doneTasks = computed(() => this.tasksSignal().filter(t => t.status === 'done'));

  // פונקציה לטעינת משימות ועדכון הסיגנל
  getTasks(projectId: number): Observable<Tasks[]> {
    const params = new HttpParams().set('projectId', projectId.toString());
    return this.http.get<Tasks[]>(this.API_URL, { params }).pipe(
      tap(tasks => this.tasksSignal.set(tasks)) // מעדכן את ה-Signal ברגע שהנתונים מגיעים
    );
  }

  createTask(task: { projectId: number; title: string }): Observable<Tasks> {
    return this.http.post<Tasks>(this.API_URL, task).pipe(
      tap(newTask => this.tasksSignal.update(tasks => [...tasks, newTask]))
    );
  }

  updateTask(id: number, updates: { status?: string; priority?: string }): Observable<Tasks> {
    return this.http.patch<Tasks>(`${this.API_URL}/${id}`, updates).pipe(
      tap(updatedTask => this.tasksSignal.update(tasks => 
        tasks.map(t => t.id === id ? updatedTask : t)
      ))
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => this.tasksSignal.update(tasks => tasks.filter(t => t.id !== id)))
    );
  }
}