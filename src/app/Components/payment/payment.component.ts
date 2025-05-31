import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

// App Imports
import { IOrder } from '../../Models/iorder';
import { PaymentService } from '../../Services/payment.service';

import { Type } from '@angular/core';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatSnackBarModule,
    DatePipe,
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit, OnDestroy {
  orders: IOrder[] = [];
  filteredOrders: IOrder[] = [];
  loading = true;
  monthFilter = '12m';
  error = '';

  totalRevenue = 0;
  thisMonthRevenue = 0;
  transactionsCount = 0;

  displayedColumns: string[] = [
    'date',
    'course',
    'student',
    'amount',
    'status',
    'method',
  ];

  private destroy$ = new Subject<void>();
  private paymentService = inject(PaymentService);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.loadOrders();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFilterChange(event: MatSelectChange) {
    this.monthFilter = event.value;
    this.applyFilter();
  }

  loadOrders() {
    this.loading = true;
    this.error = '';

    this.paymentService
      .getAllOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orders: IOrder[]) => {
          this.orders = orders.map((order: IOrder) => ({
            ...order,
            date: new Date(order.date).toISOString(),
          }));
          this.filteredOrders = [...this.orders];
          this.calculateMetrics();
          this.applyFilter();
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error fetching orders:', error);
          this.loading = false;
          this.error = 'Failed to load orders. Please try again later.';
          this.snackBar.open(this.error, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        },
      });
  }

  calculateMetrics() {
    this.totalRevenue = this.orders.reduce(
      (sum, order) => sum + (order.amount || 0),
      0
    );

    const now = new Date();
    const thisMonthOrders = this.orders.filter((order) => {
      const orderDate = new Date(order.date);
      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    });

    this.thisMonthRevenue = thisMonthOrders.reduce(
      (sum, order) => sum + (order.amount || 0),
      0
    );
    this.transactionsCount = this.orders.length;
  }

  private applyFilter() {
    const now = new Date();
    let filterDate = new Date();

    switch (this.monthFilter) {
      case '1m':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case '6m':
        filterDate.setMonth(now.getMonth() - 6);
        break;
      case '12m':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        this.filteredOrders = [...this.orders];
        return;
    }

    this.filteredOrders = this.orders.filter((order) => {
      const orderDate = new Date(order.date);
      return orderDate >= filterDate;
    });
  }

  exportData() {
    if (this.filteredOrders.length === 0) {
      this.snackBar.open('No data to export', 'Close', {
        duration: 3000,
      });
      return;
    }

    const headers = [
      'Date',
      'Course Title',
      'Student',
      'Amount',
      'Status',
      'Payment Method',
    ];
    const rows = this.filteredOrders.map((order) => [
      new Date(order.date).toLocaleDateString(),
      order.courseTitle,
      order.username,
      `$${order.amount?.toFixed(2)}`,
      order.status || 'Completed',
      order.paymentMethod || 'PayPal',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_${
      new Date().toISOString().split('T')[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.snackBar.open('Export completed successfully', 'Close', {
      duration: 3000,
    });
  }
}
