import { Routes } from '@angular/router';
import { MainComponent } from './Components/main/main.component';
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
    children: [{ path: '', component: UsersComponent }],
  },
  { path: 'login', component: LoginComponent },
  { path: 'logIn', component: LoginComponent },
  { path: 'Admin', component: AdminDashboardComponent },
  { path: 'setting', component: AdminComponent },
  { path: 'courses', component: Courses2Component },
];
