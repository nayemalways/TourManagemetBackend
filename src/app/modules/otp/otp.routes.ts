import express from 'express';
import { userOTPControllers } from './otp.controller';

const router = express.Router();

router.post('/send', userOTPControllers.sendMail);
router.post('/verify', userOTPControllers.verifyOTP);

export const otpRoutes = router;
