import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth';
import { Router ,RouterLink,RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl:'./login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  errorMessage: string = '';

  ngOnInit() {
    // אם כבר מחובר - אין סיבה להיות פה
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/teams']);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value as any).subscribe({
      next: () => this.router.navigate(['/teams']),
      error: (err) => {
        // לקיחת ההודעה מהשרת אם קיימת
        this.errorMessage = err.error?.message || 'המייל או הסיסמה אינם נכונים';
      }
    });
  }
}