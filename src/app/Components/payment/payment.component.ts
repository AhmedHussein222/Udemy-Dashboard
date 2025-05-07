import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  imports: [CommonModule],
})
export class PaymentComponent {
  revenueTrends = { daily: 500, monthly: 15000, yearly: 180000 };
  recentTransactions = [
    {
      student: 'John Doe',
      course: 'Angular Basics',
      amount: 100,
      date: '2023-10-01',
      status: 'Paid',
    },
    {
      student: 'Jane Smith',
      course: 'React Advanced',
      amount: 120,
      date: '2023-10-02',
      status: 'Refunded',
    },
    {
      student: 'Alice Johnson',
      course: 'Vue Mastery',
      amount: 90,
      date: '2023-10-03',
      status: 'Failed',
    },
  ];
  topCourses = [
    { course: 'Angular Basics', revenue: 5000 },
    { course: 'React Advanced', revenue: 4500 },
    { course: 'Vue Mastery', revenue: 3000 },
  ];
  refundsSummary = { totalRefunds: 5, totalPayouts: 2000 };
}
