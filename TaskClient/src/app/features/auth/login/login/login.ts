import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
isLoading = signal(false);
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  errorMessage: string = '';

  ngOnInit() {

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/teams']);
    }
  }

  onSubmit() {
    this.isLoading.set(true);
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value as any).subscribe({
      next: () => {
        this.router.navigate(['/teams']);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'המייל או הסיסמה אינם נכונים';
        Swal.fire('שגיאה', this.errorMessage, 'error');
        this.isLoading.set(false);
      }
    });
  }
}