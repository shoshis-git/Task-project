import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
authService = inject(AuthService); // מכיל את ה-Signal של המשתמש
  private router = inject(Router);

  onLogout() {
    this.authService.logout(); // הפונקציה שמוחקת טוקן ומשתמש מה-LocalStorage
    this.router.navigate(['/login']);
  }
}
