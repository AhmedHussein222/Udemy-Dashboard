import { Component, OnDestroy, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../Services/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isSearchVisible: boolean = false;
  private loginSubscription?: Subscription;
  private userService: UsersService;

  constructor(private router: Router, private fb: FormBuilder) {
    this.userService = inject(UsersService);
    console.log('LoginComponent constructor initialized');
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // Test Firebase connection and get all users immediately
    console.log('Attempting to fetch all users...');
    this.userService.getAll().subscribe({
      next: (users) => {
        console.log('All Users Data:', users);
        console.log('Total users found:', users.length);
        users.forEach((user) => {
          console.log('User Details:', {
            email: user.email,
            role: user.role,
            firstName: user.first_name,
            lastName: user.last_name,
          });
        });
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        console.error('Error details:', {
          message: err.message,
          code: err.code,
          stack: err.stack,
        });
      },
    });
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      const emailControl = this.loginForm.get('email');
      const passwordControl = this.loginForm.get('password');

      // Only show validation messages if the form was submitted
      if (!emailControl?.value) {
        this.errorMessage = 'Email is required.';
        return;
      }
      
      if (!passwordControl?.value) {
        this.errorMessage = 'Password is required.';
        return;
      }

      if (emailControl?.errors?.['email']) {
        this.errorMessage = 'Please enter a valid email address.';
        return;
      }

      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.userService.getAll().subscribe({
      next: (allUsers) => {
        const matchingUser = allUsers.find(
          (user) => user.email === email && user.Password === password
        );

        if (matchingUser) {
          if (matchingUser.role === 'admin') {
            this.router.navigate(['/main']);
          } else {
            this.errorMessage = "You don't have access.";
          }
        } else {
          this.errorMessage = 'Invalid email or password.';
        }
      },
      error: () => {
        this.errorMessage = 'Error accessing user data.';
      },
    });
  }
}
