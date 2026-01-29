// src/app/core/guards/auth.guard.ts
import { inject, Injectable } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth/auth';





export const AuthGuard: CanActivateFn = (route, state) => {
  
  
  const authService = inject(AuthService);
  const router = inject(Router);

 
  if (authService.isLoggedIn()) {
    return true;
  }

 
 
  router.navigate(['/login']);
  return false;
};