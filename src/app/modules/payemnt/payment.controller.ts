/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { CatchAsync } from '../../utils/CatchAsync';
import { paymentServices } from './payment.service';
import env from '../../config/env';

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

export const paymentController = {
  successPayment,
  failedPayment,
  cancelPayment,
};
