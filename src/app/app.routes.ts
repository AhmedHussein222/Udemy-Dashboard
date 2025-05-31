import { Routes } from '@angular/router';
import { AdminComponent } from './Components/admin/admin.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { LoginComponent } from './Components/login/login.component';
import { MainComponent } from './Components/main/main.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { PaymentComponent } from './Components/payment/payment.component';
import { AuthGuard } from './guards/auth.guard';
import { CategoryComponent } from './Components/category/category.component';
import { SubcategoryComponent } from './Components/subcategory/subcategory.component';

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
      { path: 'courses', loadComponent: () => import('./Components/courses/courses.component').then(m => m.CoursesComponent) },
      { path: 'users', loadComponent:()=> import('./Components/users/users.component').then(m => m.UsersComponent) },
      { path: 'payment', component: PaymentComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'subcategory', component: SubcategoryComponent },
    ],
  },

  { path: '**', component: NotFoundComponent },
];
