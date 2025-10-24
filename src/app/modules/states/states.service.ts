import { Booking } from "../booking/booking.model"


const bookingStats = async () => {
    const totalBookingPromise = Booking.countDocuments();

    const totalBookingByStatusPromise = await Booking.aggregate([
        // stage-1 group stage
        {
            $group: {
                _id: "$status",
                count: { $sum: 1}
            }
        }
    ])


    return totalBookingByStatusPromise;
}


export const statsServices = {
    bookingStats
}