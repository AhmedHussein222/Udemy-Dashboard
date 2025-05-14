import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private router: Router) {}
  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userId', user.user_id);
    this.currentUserSubject.next(user);
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userId');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
