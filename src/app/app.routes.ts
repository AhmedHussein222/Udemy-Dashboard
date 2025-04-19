import { Routes } from '@angular/router';
import { DashboardComponent } from './Component/dashboard/dashboard.component';
import { NavbarComponent } from './Component/navbar/navbar.component';
import { NotFoundComponent } from './Component/not-found/not-found.component';

export const routes: Routes = [

        // {path:'',redirectTo:'Dashboard',pathMatch:'full'},
        {path:'Dashboard',component:DashboardComponent,title:'Dashboard'},
       {path:'**',component:NotFoundComponent},
];
