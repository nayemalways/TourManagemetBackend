import { model, Schema } from 'mongoose';
import { IPayment, PAYEMNT_STATUS } from './payment.interface';

const PaymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      unique: true,
    },
    transectionId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: Object.values(PAYEMNT_STATUS),
      default: PAYEMNT_STATUS.UNPAID,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentGetwayData: {
      type: Schema.Types.Mixed,
    },
    invoiceURL: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Payment = model<IPayment>('Payment', PaymentSchema);
