import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IOrder } from '../Models/iorder';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private mockOrders: IOrder[] = [
    {
      id: '1',
      date: new Date().toISOString(),
      courseTitle: 'Angular Development',
      username: 'John Doe',
      amount: 99.99,
      status: 'Completed',
      paymentMethod: 'Credit Card',
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      courseTitle: 'React Fundamentals',
      username: 'Jane Smith',
      amount: 79.99,
      status: 'Completed',
      paymentMethod: 'PayPal',
    },
  ];

  constructor() {}

  getAllOrders(): Observable<IOrder[]> {
    // TODO: Replace with actual API call
    return of(this.mockOrders);
  }

  addOrder(order: IOrder): Observable<IOrder> {
    // TODO: Replace with actual API call
    this.mockOrders.push(order);
    return of(order);
  }
}
