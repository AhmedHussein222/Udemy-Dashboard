import { Routes } from '@angular/router';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { MainComponent } from './Components/main/main.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { UsersComponent } from './Components/users/users.component';
import { LoginComponent } from './Components/login/login.component';
import { AdminDashboardComponent } from './Components/admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './Components/admin/admin.component';
import { Courses2Component } from './Components/courses2/courses2.component';
import { CoursesComponent } from './Components/courses/courses.component';
import { PaymentComponent } from './Components/payment/payment.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'main/Dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
      { path: 'Dashboard', component: DashboardComponent },
      { path: 'Admin', component: AdminComponent },
      { path: 'courses2', component: Courses2Component },
      { path: 'courses', component: CoursesComponent },
      { path: 'users', component: UsersComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'admin-dashboard', component: AdminDashboardComponent },
    ],
  },
  {
    path: 'Admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', component: NotFoundComponent },
];
