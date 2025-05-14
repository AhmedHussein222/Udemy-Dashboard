// login.component.ts
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../Services/users.service';
import { AuthService } from '../../Services/auth.service';

// Define interface for user data
interface Iuser {
  user_id: string;
  email: string;
  password: string;
  role: string;
  // other user properties as needed
}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  private loginSubscription?: Subscription;
  private userService = inject(UsersService);
  private authService = inject(AuthService);
  isSearchVisible: boolean = false;

  constructor(private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  ngOnInit() {
    // Check if user is already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/main/Dashboard']);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.handleFormValidation();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const { email, password } = this.loginForm.value;

    this.loginSubscription = this.userService.getUserByEmail(email).subscribe({
      next: (user: Iuser | null) => {
        this.loading = false;

        if (!user) {
          this.errorMessage = 'Invalid email or password.';
          return;
        }
        if (user.password === password) {
          if (user.role === 'admin') {
            // Store user data and update auth state
            this.authService.login(user);
            // Navigate to dashboard
            this.router.navigate(['/main/Dashboard']);
          } else {
            this.errorMessage = "You don't have access to admin panel.";
          }
        } else {
          this.errorMessage = 'Invalid email or password.';
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Error accessing user data. Please try again.';
        console.error('Login error:', error);
      },
    });
  }

  private handleFormValidation() {
    const { email, password } = this.loginForm.controls;

    if (!email.value) {
      this.errorMessage = 'Email is required.';
    } else if (email.errors?.['email']) {
      this.errorMessage = 'Please enter a valid email address.';
    } else if (!password.value) {
      this.errorMessage = 'Password is required.';
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}
