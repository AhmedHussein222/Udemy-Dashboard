import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './Component/sidebar/sidebar.component';
import { DashboardComponent } from './Component/dashboard/dashboard.component';
import { NavbarComponent } from './Component/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [DashboardComponent, RouterOutlet,NavbarComponent ,SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Udemy-Dashboard';
}
