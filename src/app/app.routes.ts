import { Routes } from '@angular/router';
import { MainComponent } from './Components/main/main.component';
import { UsersComponent } from './Components/users/users.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';

export const routes: Routes = [
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {path: 'main', component :MainComponent ,children:
    [
      {path:'',component:UsersComponent},
      {path:'Dashboard',component:DashboardComponent},
      
    ]
  }
];
