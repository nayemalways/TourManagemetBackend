/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { CatchAsync } from '../../utils/CatchAsync';
import { paymentServices } from './payment.service';
import env from '../../config/env';
import { SendResponse } from '../../utils/SendResponse';
import httpStatus from 'http-status-codes';

// Manual Payment Init
const initPayment = CatchAsync(async (req: Request, res: Response) => {
  const { booking_id } = req.params;
  const result = await paymentServices.initPayment(booking_id);
  SendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Payment done success',
    data: result,
  });
});
const successPayment = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await paymentServices.paymentSuccessService(
      query as Record<string, string>
    );
    if (result.success) {
      res.redirect(
        `${env.CLIENT_SUCCESS_URL}/transaction_id=${query.transaction_id}&amount=${query.amount}&status=${query.status}`
      );
    }
  }
);
const failedPayment = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await paymentServices.paymentFailService(
      query as Record<string, string>
    );

    if (!result.success) {
      res.redirect(
        `${env.CLIENT_FAIL_URL}/transaction_id=${query.transaction_id}&amount=${query.amount}&status=${query.status}`
      );
    }
  }
);
const cancelPayment = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await paymentServices.paymentCancelService(
      query as Record<string, string>
    );

    if (!result.success) {
      res.redirect(
        `${env.CLIENT_CANCEL_URL}/transaction_id=${query.transaction_id}&amount=${query.amount}&status=${query.status}`
      );
    }
  }
);

const downloadInvoice = async (req: Request, res: Response) => {
  const { paymentId } = req.params;
  const result = await paymentServices.getInvoiceDownloadURL(paymentId);

  SendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Invoice url fetched successfully',
    data: result,
  });
};

export const paymentController = {
  successPayment,
  failedPayment,
  cancelPayment,
  initPayment,
  downloadInvoice,
};
