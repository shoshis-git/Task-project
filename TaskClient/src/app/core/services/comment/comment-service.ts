import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Comments } from '../../../shared/modales';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/comments`;


  getComments(taskId: number): Observable<Comments[]> {
    const params = new HttpParams().set('taskId', taskId.toString());
    return this.http.get<Comments[]>(this.API_URL, { params });
  }


  addComment(commentData: { taskId: number; body: string }): Observable<Comments> {
    return this.http.post<Comments>(this.API_URL, commentData);
  }
}
