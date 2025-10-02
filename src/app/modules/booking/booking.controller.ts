/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { CatchAsync } from "../../utils/CatchAsync";
import { JwtPayload } from "jsonwebtoken";
import { bookingService } from "./booking.service";
import { SendResponse } from "../../utils/SendResponse";


const createBooking = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await bookingService.createBooking(req.body , decodedToken.userId);
    SendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Booking Created Successfully!",
        data: result
    })
});


export const bookingControllers = {
    createBooking
}