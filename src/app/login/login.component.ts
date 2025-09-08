import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule, // ✅ For *ngIf, *ngFor, etc.
    FormsModule   // ✅ For ngModel and ngForm
    //  // Import necessary modules here if needed
  ],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  // Dummy credentials
  private readonly dummyUser = 'user123';
  private readonly dummyPass = 'pass123';

  constructor(private router: Router) {}

  login() {
    console.log(this.username,"username")
    if (this.username === this.dummyUser && this.password === this.dummyPass) {
      this.errorMessage = '';
      this.router.navigate(['/dashboard']);  // Navigate to next page
    } else {
      this.errorMessage = 'Invalid username or password.';
    }
  }
}
