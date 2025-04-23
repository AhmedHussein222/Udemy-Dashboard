import { Component, inject } from '@angular/core';
import { Chart, ChartModule } from 'angular-highcharts';
import { Iuser } from '../../Models/iuser/iuser';
import { UsersService } from '../../Services/users.service';
@Component({
  selector: 'app-users',
  imports: [ ChartModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  private firestore = inject(UsersService);
  users!: Iuser[];

  constructor() {
    // this.users = this.firestore.getAll('Users')
    this.firestore.getAll('Users').subscribe((data) => {
      this.users = data;
    });

  }
  testchart = new Chart({
    title: { text: 'Users by Role' },
    series: [
      {
        type: 'pie',

        data: [
          { name: 'Student', y: 60, color: '#483D8B' },
          { name: 'instructors', y: 20, color: '#7B68EE' },
        ],
      },
    ],
  });

  trackByEmail(index: number, user: any): string {
    return user.email;
  }
}
