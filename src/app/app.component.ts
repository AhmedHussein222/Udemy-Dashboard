import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MainComponent } from './Components/main/main.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,MainComponent,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Udemy-Dashboard';
}
