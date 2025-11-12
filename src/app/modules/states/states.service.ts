/* eslint-disable @typescript-eslint/no-explicit-any */
import { Booking } from '../booking/booking.model';
import { PAYEMNT_STATUS } from '../payemnt/payment.interface';
import { Payment } from '../payemnt/payment.model';
import { Tour } from '../tour/tour.model';
import { IsActive } from '../user/user.interface';
import { User } from '../user/user.model';

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getUserStats = async () => {
  const totalUsers = await User.countDocuments();
  const totalActiveUsers = await User.countDocuments({
    isActive: IsActive.ACTIVE,
  });
  const totalInactiveUsers = await User.countDocuments({
    isActive: IsActive.INACTIVE,
  });
  const totalBlockedUsers = await User.countDocuments({
    isActive: IsActive.BLOCKED,
  });
  const last7DaysTotalUsers = await User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const last30DaysTotalUsers = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const totalUserByRole = await User.aggregate([
    // stage
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
      },
    },
  ]);
  return {
    total_users: totalUsers,
    total_active_users: totalActiveUsers,
    total_inactive_users: totalInactiveUsers,
    total_blocked_users: totalBlockedUsers,
    last_7_days_total_users: last7DaysTotalUsers,
    last_30_days_total_users: last30DaysTotalUsers,
    users_by_role: totalUserByRole,
  };
};

const getTourStats = async () => {
  const total_tours = await Tour.countDocuments();
  const total_tours_by_tourType = await Tour.aggregate([
    // Stage 1: Join Tour Types with tour
    {
      $lookup: {
        from: 'tourtypes',
        localField: 'tourType',
        foreignField: '_id',
        as: 'type',
      },
    },

    // Stage 2: Unwind type
    {
      $unwind: '$type',
    },

    // Stage 3: Grouping
    {
      $group: {
        _id: '$type.name',
        count: { $sum: 1 },
      },
    },

    // Stage 4: Sorting
    // Stage 2: Sorting stage
    {
      $sort: { count: -1 },
    },
  ]);
  const avg_tour_cost = await Tour.aggregate([
    {
      $group: {
        _id: null,
        avg: { $avg: '$costFrom' },
      },
    },
  ]);
  const total_tour_by_division = await Tour.aggregate([
    // Stage 1: Join division
    {
      $lookup: {
        from: 'divisions',
        localField: 'division',
        foreignField: '_id',
        as: 'division',
      },
    },

    // Stage 2: Unwind division
    {
      $unwind: '$division',
    },

    // Stage 3: Group by division
    {
      $group: {
        _id: '$division.name',
        count: { $sum: 1 },
      },
    },

    // Stage 4: Sorting stage
    {
      $sort: { count: -1 },
    },
  ]);
  const hightest_booked_tours = await Booking.aggregate([
    // Stage 1: Grouping stage
    {
      $group: {
        _id: '$tour',
        count: { $sum: 1 },
      },
    },

    // Stage 2: Sorting stage
    {
      $sort: { count: -1 },
    },

    // Stage 3: Limit 5
    {
      $limit: 5,
    },

    // stage 4: Join with tour
    {
      $lookup: {
        from: 'tours',
        localField: '_id',
        foreignField: '_id',
        as: 'tour',
      },
    },

    // Stage 5: Unwind tour
    {
      $unwind: '$tour',
    },

    // Stage 6: Projection
    {
      $project: {
        _id: 1,
        count: 1,
        'tour.title': 1,
      },
    },
  ]);

  return {
    total_tours,
    total_tours_by_tourType,
    avg_tour_cost,
    total_tour_by_division,
    hightest_booked_tours,
  };
};

const bookingStats = async () => {
  const totalBookingPromise = Booking.countDocuments();
  const totalBookingByStatusPromise = Booking.aggregate([
    // stage-1 group stage
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);
  const bookingPerTourPromise = Booking.aggregate([
    // stage-1 group stage

    {
      $group: {
        _id: '$tour',
        bookingCount: { $sum: 1 },
      },
    },

    // stage-2 sort stage
    {
      $sort: { bookingCount: -1 },
    },

    // stage-3 limit stage
    {
      $limit: 10,
    },

    // stage-4 lookup stage
    {
      $lookup: {
        from: 'tours',
        localField: '_id',
        foreignField: '_id',
        as: 'tour',
      },
    },

    // stage-5 unwind stage
    {
      $unwind: '$tour',
    },

    // stage-6 project stage
    {
      $project: {
        bookingCount: 1,
        _id: 1,
        'tour.title': 1,
        'tour.slug': 1,
      },
    },
  ]);
  const avgGuestCountPerBookingPromise = Booking.aggregate([
    // stage-1: group stage
    {
      $group: {
        _id: null,
        avgGuestCount: { $avg: '$guestCount' },
      },
    },
  ]);
  const bookingLast7DaysPromise = Booking.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const bookingLast30DaysPromise = Booking.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });
  const totalBookingByUniqueUsersPromise = Booking.distinct('user').then(
    (user: any) => user.length
  );

  const [
    totalBooking,
    totalBookingByStatus,
    bookingPerTour,
    avgGuestCountPerBooking,
    bookingLast7Days,
    bookingLast30Days,
    totalBookingByUniqueUsers,
  ] = await Promise.all([
    totalBookingPromise,
    totalBookingByStatusPromise,
    bookingPerTourPromise,
    avgGuestCountPerBookingPromise,
    bookingLast7DaysPromise,
    bookingLast30DaysPromise,
    totalBookingByUniqueUsersPromise,
  ]);
  return {
    totalBooking,
    avgGuestCountPerBooking: avgGuestCountPerBooking[0].avgGuestCount,
    bookingLast7Days,
    bookingLast30Days,
    totalBookingByUniqueUsers,
    totalBookingByStatus,
    bookingPerTour,
  };
};

const getPaymentStats = async () => {
  const totalPaymentPromise = Payment.countDocuments();
  const totalPaymentByStatusPromise = Payment.aggregate([
    // stage-1: group
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);
  const totalRevenuePromise = Payment.aggregate([
    // stage-1 match stage
    {
      $match: { status: PAYEMNT_STATUS.PAID },
    },

    // stage-2: group
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
      },
    },
  ]);
  const avgPaymentAmountPromise = Payment.aggregate([
    //stage-1: group stage
    {
      $group: {
        _id: null,
        avgPaymentAmount: { $avg: '$amount' },
      },
    },
  ]);
  const paymentGetewayDataPromise = Payment.aggregate([
    // stage-1: group stage
    {
      $group: {
        _id: { $ifNull: ['$paymentGetewayData.status', 'UNKNOWN'] },
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalPayment,
    totalPaymentByStatus,
    totalRevenue,
    avgPaymentAmount,
    paymentGetewayData,
  ] = await Promise.all([
    totalPaymentPromise,
    totalPaymentByStatusPromise,
    totalRevenuePromise,
    avgPaymentAmountPromise,
    paymentGetewayDataPromise,
  ]);

  return {
    totalPayment,
    totalRevenue: totalRevenue[0].totalRevenue,
    avgPaymentAmount: avgPaymentAmount[0].avgPaymentAmount,
    totalPaymentByStatus,
    paymentGetewayData,
  };
};

export const statsServices = {
  bookingStats,
  getPaymentStats,
  getUserStats,
  getTourStats,
};
