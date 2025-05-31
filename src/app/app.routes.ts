import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './Components/admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './Components/admin/admin.component';
import { Courses2Component } from './Components/courses2/courses2.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { LoginComponent } from './Components/login/login.component';
import { MainComponent } from './Components/main/main.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
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
      { path: 'courses', loadComponent: () => import('./Components/courses/courses.component').then(m => m.CoursesComponent) },
      { path: 'users', loadComponent:()=> import('./Components/users/users.component').then(m => m.UsersComponent) },
      { path: 'admin-dashboard', loadComponent: () => import('./Components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
    ],
  },
  {
    path: 'Admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', component: NotFoundComponent },
];
