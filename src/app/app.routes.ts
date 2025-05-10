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

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  {
    path: 'main',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
      { path: 'Dashboard', component: DashboardComponent },
      { path: 'Admin', component: AdminComponent },
      { path: 'courses2', component: Courses2Component },
      { path: 'courses', component: CoursesComponent },


      { path: 'users', component: UsersComponent },
      { path: 'login', component: LoginComponent },
      { path: 'admin-dashboard', component: AdminDashboardComponent },

    ],
  },
  { path: 'Admin', component: AdminDashboardComponent },
  { path: 'logIn', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: NotFoundComponent },
];