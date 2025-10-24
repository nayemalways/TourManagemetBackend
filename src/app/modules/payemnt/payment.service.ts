/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '../../errorHelpers/AppError';
import { IBookingStatus } from '../booking/booking.interface';
import { Booking } from '../booking/booking.model';
import { SSL_Payment } from '../ssl_ecommerz/ssl_commerz.service';
import { PAYEMNT_STATUS } from './payment.interface';
import { Payment } from './payment.model';
import  httpStatus  from 'http-status-codes';

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });

  if (!payment) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment not found. You have not booked this tour!");
  }

  const booking = await Booking.findById(payment.booking).populate('user');

  const userAddress = (booking?.user as any).address
  const userEmail = (booking?.user as any).email
  const userPhoneNumber = (booking?.user as any).phone
  const userName = (booking?.user as any).name

  const ssl_payload = {
    address:userAddress,
    email: userEmail,
    phone:userPhoneNumber,
    name: userName,
    amount: payment.amount,
    transactionId: payment.transectionId
  }

  const sslPayment = await SSL_Payment(ssl_payload)
 
  return { paymentURL: sslPayment.GatewayPageURL };
}
const paymentSuccessService = async (query: Record<string, string>) => {
  const transection_id = query.transection_id;

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatePayment = await Payment.findOneAndUpdate(
      { transectionId: transection_id },
      { status: PAYEMNT_STATUS.PAID },
      { new: true, runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatePayment?.booking,
      { status: IBookingStatus.COMPLETE },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: true, message: 'Tour payment success!' };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.log('Tour payment failed', error.message);
    throw error;
  }
};
const paymentFailService = async (query: Record<string, string>) => {
  const transection_id = query.transection_id;

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatePayment = await Payment.findOneAndUpdate(
      { transectionId: transection_id },
      { status: PAYEMNT_STATUS.FAILED },
      { new: true, runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatePayment?.booking,
      { status: IBookingStatus.FAILED },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: false, message: 'Tour payment failed!' };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.log('Tour payment failed', error.message);
    throw error;
  }
};
const paymentCancelService = async (query: Record<string, string>) => {
  const transection_id = query.transection_id;

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatePayment = await Payment.findOneAndUpdate(
      { transectionId: transection_id },
      { status: PAYEMNT_STATUS.CANCELED },
      { new: true, runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatePayment?.booking,
      { status: IBookingStatus.CANCEL },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: false, message: 'Tour payment cancel!' };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.log('Tour payment failed', error.message);
    throw error;
  }
};

export const paymentServices = {
  paymentSuccessService,
  paymentFailService,
  paymentCancelService,
  initPayment
};
