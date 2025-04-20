import { Routes } from '@angular/router';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';

export const routes: Routes = [

        // {path:'',redirectTo:'Dashboard',pathMatch:'full'},
        {path:'Dashboard',component:DashboardComponent,title:'Dashboard'},
       {path:'**',component:NotFoundComponent},
];
