import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  private readonly dummyUser = 'user123';
  private readonly dummyPass = 'pass123';
  rememberMe: boolean = false; // Add property for checkbox

  constructor(private router: Router) {}

  login() {
    console.log('Attempting login with:', this.username, this.password);
    if (this.username === this.dummyUser && this.password === this.dummyPass) {
      this.errorMessage = '';
      console.log('Navigating to /dashboard');
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Invalid username or password.';
    }
  }
}