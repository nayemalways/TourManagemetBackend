/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { CatchAsync } from '../../utils/CatchAsync';
import { SendResponse } from '../../utils/SendResponse';
import httpStatus from 'http-status-codes';
import { statsServices } from './states.service';

const getUserStats = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statsServices.getUserStats();

    SendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User stats fetched success!',
      data: result,
    });
  }
);

const bookingStats = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statsServices.bookingStats();
    SendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Book stats fetched successfully',
      data: result,
    });
  }
);

const getTourStats = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statsServices.getTourStats();

    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Tour stats fetched successfull!',
      data: result,
    });
  }
);

const paymentStats = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statsServices.getPaymentStats();
    SendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Payment stats fetched successfully',
      data: result,
    });
  }
);

export const statsControllers = {
  bookingStats,
  paymentStats,
  getUserStats,
  getTourStats,
};
