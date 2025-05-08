import { Routes } from '@angular/router';
// import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { MainComponent } from './Components/main/main.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { UsersComponent } from './Components/users/users.component';
import { CoursesComponent } from './Components/courses/courses.component';


export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  {
    path: 'main',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
      // { path: 'Dashboard', component: DashboardComponent },
      { path: 'Users', component: UsersComponent },
      {path:'Courses', component: CoursesComponent},

    ],
  },
  { path: '**', component: NotFoundComponent },
];
