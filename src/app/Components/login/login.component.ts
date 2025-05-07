import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Iuser } from '../../Models/iuser/iuser';
import { UsersService } from '../../Services/users.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  users!: Iuser[];

  private authSubject = new Subject<{
    name: string;
    email: string;
    provider: string;
  }>();

  isSearchVisible = false;
  private firestore = inject(UsersService);

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    private router: Router
    
  ) {
    this.initializeForm();
    this.firestore.getAll('Users').subscribe((data) => {
      this.users = data;
      // console.log(this.users);
      
    });
  }

  private initializeForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill all fields correctly';
      return;
    }
    const { email, password } = this.loginForm.value;
    this.errorMessage = null;
    try {


          if (!this.users || this.users.length === 0) {
            this.errorMessage = 'No registered users found';
            return;
          }
          // Find user with matching credentials
          const userFound = this.users.find(
            (user: Iuser) => user.email === email && user.Password === password
          );
          console.log(userFound);
          

          if (!userFound) {
            this.errorMessage = 'Username or password is incorrect';
            return;
          }

          this.handleUserRole(userFound.role);

    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage = 'An error occurred. Please try again later';
    }
  }

  private handleUserRole(role: string) {
    console.log(role);
    
    if (role === 'Admin') {
      this.router.navigate(['/admin']);
    } else {
      this.errorMessage = 'You do not have the necessary permissions';
    }
  }

  loginWithGoogle() {
    this.openPopup('Google', 'https://auth.google.com');
  }

  loginWithFacebook() {
    this.openPopup('Facebook', 'https://facebook.com/dialog/oauth');
  }

  loginWithApple() {
    this.openPopup('Apple', 'https://appleid.apple.com/auth/authorize');
  }

  private openPopup(provider: string, url: string) {
    const width = 400;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      url,
      `${provider} Login`,
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );

    if (popup) {
      const interval = setInterval(() => {
        if (popup.closed) {
          clearInterval(interval);
          this.authSubject.next({
            name: `${provider} User`,
            email: `${provider.toLowerCase()}@example.com`,
            provider,
          });

          // Simulate login to your site using the social account
          this.simulateSocialLogin(`${provider.toLowerCase()}@example.com`);
        }
      }, 500);
    }
  }

  private simulateSocialLogin(email: string) {
    // Simulate checking if the user exists in your database
    this.usersService.getAll('Users').subscribe((users) => {
      const userFound = users.find((user: Iuser) => user.email === email);

      if (userFound) {
        this.handleUserRole(userFound.role);
      } else {
        this.errorMessage = 'No account found for this social email.';
      }
    });
  }

  onAuthSuccess() {
    return this.authSubject.asObservable();
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
  }
}
