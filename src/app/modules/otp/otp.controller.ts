/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { userOTPservice } from './otp.service';
import { SendResponse } from '../../utils/SendResponse';

const sendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  await userOTPservice.sendOTP(email);
  SendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'OTP sent successfully',
    data: null,
  });
};
const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp, email } = req.body;
  await userOTPservice.verifyOTP(email, otp);
  SendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User verified successfully',
    data: null,
  });
};

export const userOTPControllers = {
  sendOTP,
  verifyOTP,
};
