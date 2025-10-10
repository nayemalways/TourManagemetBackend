import express from 'express';
import { userOTPControllers } from './otp.controller';

const router = express.Router();

router.post("/send", userOTPControllers.sendMail);

export const otpRoutes = router;