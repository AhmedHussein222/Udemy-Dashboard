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
  loading: boolean = false; // Add loading state
  private loginSubscription?: Subscription;
  private userService: UsersService;
  isSearchVisible: boolean = false;

  constructor(private router: Router, private fb: FormBuilder) {
    this.userService = inject(UsersService);
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Check if user is already logged in
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.router.navigate(['/main']);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.handleFormValidation();
      return;
    }

    this.loading = true; // Start loading
    this.errorMessage = ''; // Clear previous errors
    const { email, password } = this.loginForm.value;

    this.loginSubscription = this.userService.getUserByEmail(email).subscribe({
      next: (user: Iuser | null) => {
        this.loading = false; // End loading

        if (!user) {
          this.errorMessage = 'Invalid email or password.';
          return;
        }

        // Compare passwords - this is the fix for issue #1
        // Make sure to compare the exact format of passwords
        if (user.password === password) {
          if (user.role === 'admin') {
            localStorage.setItem('userId', user.user_id);
            localStorage.setItem('currentUser', JSON.stringify(user)); // Store user data
            this.router.navigate(['/main']);
          } else {
            this.errorMessage = "You don't have access to admin panel.";
          }
        } else {
          this.errorMessage = 'Invalid email or password.';
          console.log('Password mismatch:', {
            provided: password,
            stored: user.password,
            match: user.password === password,
          });
        }
      },
      error: (error) => {
        this.loading = false; // End loading
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
