import { Routes } from '@angular/router';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { MainComponent } from './Components/main/main.component';
import { UsersComponent } from './Components/users/users.component';

export const routes: Routes = [
        {
                path: 'main',
                component: MainComponent,
                children: [
                  { path: '', component: UsersComponent },
                  { path: 'Dashboard', component: DashboardComponent, title: 'Dashboard' },
                  { path: '**', component: NotFoundComponent },
                ],
              }
              
      ];
      
