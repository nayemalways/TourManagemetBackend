import { Types } from 'mongoose';

export enum PAYEMNT_STATUS {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  CANCELED = 'CANCELED',
  FAILED = 'FAILED',
  REFUND = 'REFUND',
}

export interface IPayment {
  booking: Types.ObjectId;
  transectionId: string;
  amount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentGetwayData?: any;
  invoiceURL?: string;
  status: PAYEMNT_STATUS;
}
