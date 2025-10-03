import AppError from '../../errorHelpers/AppError';
import { SSL_Payment } from '../../ssl_ecommerz/ssl_commerz.service';
import { generateTransectionId } from '../../utils/getTransectionid';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { PAYEMNT_STATUS } from '../payemnt/payment.interface';
import { Payment } from '../payemnt/payment.model';
import { Tour } from '../tour/tour.model';
import { User } from '../user/user.model';
import { IBooking, IBookingStatus } from './booking.interface';
import { Booking } from './booking.model';

interface PaymentIUser {
  _id: string;
  address: string;
  email: string;
  phone: string;
  name: string;
}

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transectionId = generateTransectionId();
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);
    if (!user?.phone || !user?.address) {
      throw new AppError(
        500,
        'Please update your profile information phone & address'
      );
    }

    const tour = await Tour.findById(payload.tour).select('costFrom');

    if (!tour?.costFrom) {
      throw new AppError(400, 'Tour cost not found!');
    }

    const totalAmount = Number(tour?.costFrom) * Number(payload.guestCount);

    const booking = await Booking.create(
      [
        {
          user: userId,
          status: IBookingStatus.PENDING,
          ...payload,
        },
      ],
      { session }
    );

    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          transectionId: transectionId,
          status: PAYEMNT_STATUS.UNPAID,
          amount: totalAmount,
        },
      ],
      { session }
    );

    const updateBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session }
    )
      .populate('user', 'name email phone address')
      .populate('tour', 'title costFrom startDate endDate')
      .populate('payment');

    const userPopulated = updateBooking?.user as unknown as PaymentIUser;

    const paymentGet = await SSL_Payment({
      address: userPopulated?.address,
      phone: userPopulated.phone,
      email: userPopulated.email,
      name: userPopulated?.name,
      transactionId: transectionId,
      amount: totalAmount,
    });

    await session.commitTransaction();
    session.endSession();

    return {
      booking: updateBooking,
      paymentUrl: paymentGet?.GatewayPageURL,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllBooking = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Booking.find(), query);

  const searchableFields = [
    'status',
    'payment.transectionId',
    'payment.status',
  ];

  const booking = await queryBuilder
    .filter()
    .search(searchableFields)
    .select()
    .sort()
    .paginate()
    .join(['payment'])
    .build();

  const meta = await queryBuilder.getMeta();

  return {
    booking,
    meta,
  };
};

export const bookingService = {
  createBooking,
  getAllBooking,
};
