/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { uploadBufferToCloudinary } from '../../config/cloudinary.config';
import AppError from '../../errorHelpers/AppError';
import { generatePDF, IInvoiceData } from '../../utils/invoice';
import { sendEmail } from '../../utils/sendMail';
import { IBookingStatus } from '../booking/booking.interface';
import { Booking } from '../booking/booking.model';
import { SSL_Payment } from '../ssl_ecommerz/ssl_commerz.service';
import { ITour } from '../tour/tour.interface';
import { IUser } from '../user/user.interface';
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

  const sslPayment = await SSL_Payment(ssl_payload);
 
  // GatewayPageURL isn't declared on the typed response, cast to any to access it safely
  const paymentURL = (sslPayment as any)?.GatewayPageURL;
  return { paymentURL };
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

    if (!updatePayment) {
      throw new AppError(400, "Payment not found");
    }

    const updateBooking = await Booking.findByIdAndUpdate(
      updatePayment?.booking,
      { status: IBookingStatus.COMPLETE },
      { new: true, runValidators: true, session }
    ).populate("tour", "title").populate("user", "name email");

    if (!updateBooking) {
      throw new AppError(400, "Booking not found");
    }


    // Generate Invoice
    const invoiceData: IInvoiceData = {
      bookingDate: (updateBooking as any).createdAt as Date,
      guestCount: updateBooking.guestCount,
      totalAmount: updatePayment.amount,
      tourTitle: (updateBooking.tour as unknown as ITour).title as string,
      userName: (updateBooking.user as unknown as IUser).name as string,
      transactionId: updatePayment.transectionId,
      invoiceURL: ''
    }


    const pdfBuffer = await generatePDF(invoiceData)
    const cloudinaryResult = await uploadBufferToCloudinary(pdfBuffer, "invoice2.0");

    if (!cloudinaryResult) {
      throw new AppError(401, "Error uploading pdf");
    }

    

  const paymentUpdateByInvoiceURL =  await Payment.findByIdAndUpdate(updatePayment._id, { invoiceURL: cloudinaryResult.secure_url }, { runValidators: true, new: true, session});
 
  invoiceData.invoiceURL = paymentUpdateByInvoiceURL?.invoiceURL as string;

    await sendEmail({
      to: (updateBooking.user as unknown as IUser).email,
      subject: "Your Booking Invoice",
      templateName: "invoice",
      templateData: invoiceData,
      attachements: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    })


    await session.commitTransaction();
    session.endSession();

    return { success: true, message: 'Payment Completed Successfully!' };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.log('Tour payment failed', error.message);
    // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
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
const getInvoiceDownloadURL = async (paymentId: string) => {
  const payment = await Payment.findById(paymentId);

  if(!payment) {
    throw new AppError(401, "Payment not found");
  }

  if(!payment.invoiceURL) {
    throw new AppError(401, "NO invoice found");
  }

  return payment.invoiceURL;
}

export const paymentServices = {
  paymentSuccessService,
  paymentFailService,
  paymentCancelService,
  initPayment,
  getInvoiceDownloadURL
};
