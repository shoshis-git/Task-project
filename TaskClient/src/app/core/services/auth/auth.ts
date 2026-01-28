import { computed, Injectable, signal } from '@angular/core';
import { User } from '../../../shared/modales';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  
  // Signal לשמירת נתוני המשתמש הנוכחי במערכת
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) {
    
  }

  // התחברות: אימייל וסיסמה בלבד
  login(credentials: { email: string; password: string }): Observable<{token: string, user: User}> {
    return this.http.post<{token: string, user: User}>(`${this.API_URL}/login`, credentials)
      .pipe(tap(res => this.handleAuthentication(res)));
  }

  // הרשמה: שם, אימייל וסיסמה
  register(data: { name: string; email: string; password: string }): Observable<{token: string, user: User}> {
    return this.http.post<{token: string, user: User}>(`${this.API_URL}/register`, data)
      .pipe(tap(res => this.handleAuthentication(res)));
  }

  private handleAuthentication(res: {token: string, user: User}) {
    localStorage.setItem('token', res.token);
    this.currentUser.set(res.user);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
   
  }
}