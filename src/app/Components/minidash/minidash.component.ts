import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './minidash.component.html',
  styleUrls: ['./minidash.component.css'],
  imports: [CommonModule], // Import CommonModule for AsyncPipe
})
export class DashboardComponent {
  @Input() users$: Observable<any[]> = new Observable();
  @Input() revenue$: Observable<number> = new Observable();
  @Input() courses$: Observable<any[]> = new Observable();
}
