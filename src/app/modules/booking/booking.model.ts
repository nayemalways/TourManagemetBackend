import { model, Schema } from "mongoose";
import { IBooking, IBookingStatus } from "./booking.interface";


const BookingSchema = new Schema<IBooking>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tour: {
        type: Schema.Types.ObjectId,
        ref: "Tour",
        required: true
    },
    payment: {
        type: Schema.Types.ObjectId,
        ref: "Payment"
    },
    status: {
        type: String,
        enum: Object.values(IBookingStatus),
        default: IBookingStatus.PENDING
    },
    guestCount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

export const Booking = model<IBooking>("Booking", BookingSchema);