// src/app/core/guards/auth.guard.ts
import { inject, Injectable } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth/auth';




// שימי לב: ה-inject חייב לקרות *בתוך* הפונקציה שרצה, לא מחוצה לה
export const AuthGuard: CanActivateFn = (route, state) => {
  
  // ✅ כאן זה המקום הנכון להשתמש ב-inject
  const authService = inject(AuthService);
  const router = inject(Router);

  // בדיקה האם המשתמש מחובר (בודקים אם יש אובייקט משתמש או טוקן)
  if (authService.isLoggedIn()) {
    return true;
  }

  // אם לא מחובר - זורקים אותו ללוגין
  console.log('Access denied - redirecting to login');
  router.navigate(['/login']);
  return false;
};