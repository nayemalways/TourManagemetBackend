import { Types } from 'mongoose';

export enum IBookingStatus {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  CANCEL = 'CANCEL',
  COMPLETE = 'COMPLETE',
}

export interface IBooking {
  user: Types.ObjectId;
  tour: Types.ObjectId;
  payment?: Types.ObjectId;
  guestCount: number;
  status: IBookingStatus;
}
