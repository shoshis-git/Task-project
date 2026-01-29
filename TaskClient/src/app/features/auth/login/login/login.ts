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
  loginForm: FormGroup;
  constructor(private fb: FormBuilder) {  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });}
  private authService = inject(AuthService);
  private router = inject(Router);
 
  ngOnInit() {}
  errorMessage: string = '';

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
         
          this.router.navigate(['/teams']); 
        },
        error: (err) => {
          this.errorMessage = 'שגיאה בהתחברות. בדקי את המייל והסיסמה.';
        }
      });
    }
  }
}
