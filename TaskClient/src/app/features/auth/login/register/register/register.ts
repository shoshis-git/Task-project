import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  registerForm: FormGroup;
    constructor(private fb: FormBuilder) {  this.registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });}

    private authService = inject(AuthService);
  private router = inject(Router);
 
  ngOnInit() {}
  errorMessage: string = '';

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          console.log('Registration successful', res);
          this.router.navigate(['/teams']); // מעבר למסך התחברות לאחר הצלחה
        },
        error: (err) => {
          this.errorMessage = 'שגיאה בהרשמה. נסה שוב.';
        }
      });
    }
  }
}