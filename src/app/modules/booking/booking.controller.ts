/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { CatchAsync } from '../../utils/CatchAsync';
import { JwtPayload } from 'jsonwebtoken';
import { bookingService } from './booking.service';
import { SendResponse } from '../../utils/SendResponse';
import { IBookingStatus } from './booking.interface';
import  httpStatus  from 'http-status-codes';

const createBooking = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await bookingService.createBooking(
      req.body,
      decodedToken.userId
    );
    SendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Booking Created Successfully!',
      data: result,
    });
  }
);
const getAllBooking = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await bookingService.getAllBooking(
      req.query as Record<string, string>
    );
    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Booking Retrive Successfully!',
      data: result?.booking,
      meta: {
        ...result?.meta,
      },
    });
  }
);
const getUserBookings = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;
    const decodedToken = req.user as JwtPayload;
    const result = await bookingService.getUserBookings(decodedToken.userId, query);

    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Booking Retrive Successfully!',
      data: result 
    });
  }
);
const getBookingById = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.params.bookingId as string;
    const result = await bookingService.getBookingById(bookingId);

    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Booking Retrive Successfully!',
      data: result
    });
  }
);
const updateBookingStatus = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const status = req.body.status as Partial<IBookingStatus>;
    const bookingId = req.params.bookingId as string;
    const result = await bookingService.updateBookingStatus(bookingId, status);

    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Booking Retrive Successfully!',
      data: result
    });
  }
);



export const bookingControllers = {
  createBooking,
  getAllBooking,
  getBookingById,
  getUserBookings,
  updateBookingStatus
};
