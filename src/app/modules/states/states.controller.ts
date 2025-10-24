/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { CatchAsync } from "../../utils/CatchAsync";
import { SendResponse } from "../../utils/SendResponse";
import  httpStatus  from 'http-status-codes';
import { statsServices } from "./states.service";


const bookingStats = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await statsServices.bookingStats();
    SendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Book stats fetched successfully",
        data: result
    })
})


export const statsControllers = {
    bookingStats
}