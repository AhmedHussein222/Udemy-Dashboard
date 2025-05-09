import { Routes } from '@angular/router';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { MainComponent } from './Components/main/main.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { UsersComponent } from './Components/users/users.component';
import { LoginComponent } from './Components/login/login.component';
import { AdminDashboardComponent } from './Components/admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './Components/admin/admin.component';
import { Courses2Component } from './Components/courses2/courses2.component';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  {
    path: 'main',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
      { path: 'Dashboard', component: DashboardComponent },
      { path: 'Users', component: UsersComponent },
      { path: 'Admin', component: AdminComponent },
      { path: 'courses2', component: Courses2Component },
      // { path: 'Courses', component: },
    ],
  },
  { path: 'Admin', component: AdminDashboardComponent },
  { path: 'logIn', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: NotFoundComponent },
];