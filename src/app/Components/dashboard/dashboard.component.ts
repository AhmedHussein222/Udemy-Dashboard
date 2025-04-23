import { Component, inject, OnInit } from '@angular/core';
import { Chart, ChartModule } from 'angular-highcharts';
import { UsersService } from '../../Services/users.service';
import { Iuser } from '../../Models/iuser/iuser';
@Component({
  selector: 'app-dashboard',
  imports: [ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrls:['./dashboard.component.css']
})
export class DashboardComponent  {
 private UsersService=inject(UsersService);
 Users! :Iuser[];
 userCount: number = 0;
 constructor() {

  }


//   async ngOnInit(): Promise<void> {
//     await this.getUserCount();
//   }
// async getUserCount(): Promise<void> {
//   try {
//     this.userCount = await this.UsersService.getUserCount('Users');
//     console.log('User Count:', this.userCount); // تحقق من النتيجة في الـ console
//   } catch (error) {
//     console.error('Error fetching user count:', error); // التعامل مع الأخطاء
//   }
// }



  testchart=new Chart({
    title: { text: 'Users by Role' },
 series: [
  {
    type: 'pie',
    
    data:[

    {name: 'Student', y: 150,color: '#483D8B'},
    {name: 'instructors', y: 20,color: '#7B68EE'},
    {name: 'Admin', y: 1,color: '#6A5ACD'},
  ] }

 ]

});
Linecharts=new Chart({
  chart: { type: 'line' },
  title: { text: 'Enrollment Over Time' },
  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yAxis: {
    title: { text: 'Value' }
  },
  series: [{
    name: 'Data',
    type: 'line',
    data: [0, 30, 100, 50, 100, 250, 10, 30, 40, 50, 0, 50], 
  }]
});
}