import crypto from 'crypto';
import { User } from '../user/user.model';
import AppError from '../../errorHelpers/AppError';
import { redisClient } from '../../config/redis.config';
import { sendEmail } from '../../utils/sendMail';

const generateOTP = (length = 6) =>
  crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
const Expiration_time = 60 * 2; // 2 min

const sendOTP = async (email: string, name: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  if (user.isVerified) {
    throw new AppError(400, 'You are already verified');
  }

  const otp = generateOTP();
  const redisKey = `otp:${email}`;

  await redisClient.set(redisKey, otp, {
    expiration: {
      type: 'EX',
      value: Expiration_time,
    },
  });

  await sendEmail({
    to: email,
    subject: 'Your OTP Code',
    templateName: 'otp',
    templateData: {
      name: name,
      otp: otp,
    },
  });
};

const verifyOTP = async (email: string, otp: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(400, 'User not found');
  }

  if (user.isVerified) {
    throw new AppError(400, 'User already verified');
  }

  const redisKey = `otp:${email}`;
  const savedOTP = await redisClient.get(redisKey);

  if (!savedOTP) {
    throw new AppError(401, 'Invalid OTP');
  }
  if (savedOTP !== otp) {
    throw new AppError(401, 'Invalid OTP');
  }

  await Promise.all([
    User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
    redisClient.del([redisKey]),
  ]);
};

export const userOTPservice = {
  sendOTP,
  verifyOTP,
};
