import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth';
import { CommonModule } from '@angular/common';
import { RouterEvent, RouterLink } from '@angular/router';
import { ScrollRevealDirective } from "../../shared/directives/scroll-reveal";

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  authService = inject(AuthService);
}
