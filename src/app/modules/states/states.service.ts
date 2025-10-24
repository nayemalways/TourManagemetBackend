/* eslint-disable @typescript-eslint/no-explicit-any */
import { Booking } from "../booking/booking.model"


const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);


const bookingStats = async () => {
    const totalBookingPromise = Booking.countDocuments();

    const totalBookingByStatusPromise = Booking.aggregate([
        // stage-1 group stage
        {
            $group: {
                _id: "$status",
                count: { $sum: 1}
            }
        }
    ])

    const bookingPerTourPromise = Booking.aggregate([
        // stage-1 group stage

        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1}
            }
        },

        // stage-2 sort stage
        {
            $sort: { bookingCount: -1 }
        },

        // stage-3 limit stage
        {
            $limit: 10
        },

        // stage-4 lookup stage
        {
            $lookup: {
                from: "tours",
                localField: "_id",
                foreignField: "_id",
                as: "tour"
            }
        },

        // stage-5 unwind stage
        {
            $unwind: "$tour"
        },

        // stage-6 project stage
        {
            $project: {
                bookingCount: 1,
                _id: 1,
                "tour.title": 1,
                "tour.slug": 1
            }
        }
    ]);


    const avgGuestCountPerBookingPromise = Booking.aggregate([
        // stage-1: group stage
        {
            $group: {
                _id: null,
                avgGuestCount: { $avg: "$guestCount" }
            }
        }
    ])


    const bookingLast7DaysPromise = Booking.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });
    const bookingLast30DaysPromise = Booking.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });

    const totalBookingByUniqueUsersPromise = Booking.distinct("user").then((user: any) => user.length);

    const [totalBooking, totalBookingByStatus, bookingPerTour, avgGuestCountPerBooking, bookingLast7Days, bookingLast30Days, totalBookingByUniqueUsers ] = await Promise.all([
        totalBookingPromise,
        totalBookingByStatusPromise,
        bookingPerTourPromise,
        avgGuestCountPerBookingPromise,
        bookingLast7DaysPromise,
        bookingLast30DaysPromise,
        totalBookingByUniqueUsersPromise
    ])
    return  {
        totalBooking, 
        totalBookingByStatus, 
        bookingPerTour, 
        avgGuestCountPerBooking: avgGuestCountPerBooking[0].avgGuestCount, 
        bookingLast7Days, 
        bookingLast30Days, 
        totalBookingByUniqueUsers
    };
}


export const statsServices = {
    bookingStats
}