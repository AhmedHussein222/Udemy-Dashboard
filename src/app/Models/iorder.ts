export interface IOrder {
  id?: string;
  date: string;
  courseTitle: string;
  username: string;
  amount?: number;
  status?: string;
  paymentMethod?: string;
}
