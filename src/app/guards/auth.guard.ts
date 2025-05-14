import { Injectable, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import Swal from 'sweetalert2';

interface User {
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  private router = inject(Router);
  private authService = inject(AuthService);

  canActivate():
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const currentUser = this.authService.currentUserValue as User | null;

    if (currentUser) {
      // Check if user has admin role
      if (currentUser.role === 'admin') {
        return true;
      } else {
        // Show error message for non-admin users
        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'You do not have permission to access this area.',
        });
        return this.router.createUrlTree(['/login']);
      }
    }

    // Show message for unauthenticated users
    Swal.fire({
      icon: 'warning',
      title: 'Authentication Required',
      text: 'Please log in to continue.',
    });

    return this.router.createUrlTree(['/login']);
  }
}
