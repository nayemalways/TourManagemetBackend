/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { userOTPservice } from "./otp.service";
import { SendResponse } from "../../utils/SendResponse";


export const sendMail = async (req: Request, res: Response, next: NextFunction) => {
    const {name, email} = req.body;
    await userOTPservice.sendOTP(email, name);
    SendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP sent successfully",
        data: null
    })
}

export const userOTPControllers = {
    sendMail
}