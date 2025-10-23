/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcrypt from 'bcrypt';
import AppError from '../../errorHelpers/AppError';
import httpStatus from 'http-status-codes';
import { User } from '../user/user.model';
import { createNewAccessTokenWithRefreshToken } from '../../utils/user.tokens';
import { JwtPayload } from 'jsonwebtoken';
import { IAuthProvider, IsActive } from '../user/user.interface';
import jwt from 'jsonwebtoken';
import env from '../../config/env';
import { sendEmail } from '../../utils/sendMail';



/*
const credentialsLogin = async (paylod: Partial<IUser>) => {
  const { email, password } = paylod;

  const isUserExists = await User.findOne(
    { email },
    { createdAt: 0, updatedAt: 0 }
  );
  if (!isUserExists)
    throw new AppError(httpStatus.BAD_REQUEST, 'No User Found');

  // Matching Password
  const passwordMatch = await bcrypt.compare(
    password as string,
    isUserExists.password as string
  );
  if (!passwordMatch)
    throw new AppError(httpStatus.BAD_REQUEST, 'Worng Password');

  const userToken = await createUserTokens(isUserExists);

  // Hiding password for response
  const user = isUserExists.toObject();
  delete user.password;

  return {
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,
    user,
  };
};
*/

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken =
    await createNewAccessTokenWithRefreshToken(refreshToken);
  return { accessToken: newAccessToken };
};

const changePassword = async (
  decodedToken: JwtPayload,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findOne({ _id: decodedToken.userId });

  const isPasswordMatched = await bcrypt.compare(
    oldPassword,
    user!.password as string
  );
  if (!isPasswordMatched)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Password doesn't matched. Enter valid password"
    );

  user!.password = newPassword; // No need to hash password, because in user model we hashed password with pre hook middleware
  await user!.save(); // Save document

  return null;
};

const setPassword = async (decodedToken: JwtPayload, password: string) => {
  const isUserExist = await User.findOne({_id: decodedToken.userId});

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not exist");
  }

  if (isUserExist.password && isUserExist.auths?.some((providerObject) => providerObject.provider === "google")) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have already set a password. You cannot set password again");
  }

  const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: isUserExist.email
  }

  const auths: IAuthProvider[] = [...isUserExist.auths as IAuthProvider[], credentialProvider];

  isUserExist.password = password;
  isUserExist.auths = auths;

  await isUserExist.save();

  return true;
}

const resetPassword = async (
  payload: Record<string, any>,
  decodedToken: JwtPayload
) => {
  if (payload.id != decodedToken.userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You can not reset your password'
    );
  }

  const isUserExist = await User.findById(decodedToken.userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User does not exist');
  }

  // No need to hash password, because in user model we hashed password with pre hook middleware
  isUserExist!.password = payload.newPassword;
  await isUserExist!.save(); // Save document

  return null;
};

const forgetPassword = async (email: string) => {
  const isUserExist = await User.findOne({email});

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }
  if (!isUserExist.isVerified)  {
    throw new AppError(httpStatus.BAD_REQUEST, "User not verified");
  }
  if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`);
  }
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "user is deleted");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role
  };

  const resetToken = jwt.sign(jwtPayload, env.JWT_SECRET, { expiresIn: '10m'});

  const resetUILink = `${env.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;
  /**
     http://localhost:5173/reset-password?id=687f310c724151eb2fcf0c41&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODdmMzEwYzcyNDE1MWViMmZjZjBjNDEiLCJlbWFpbCI6InNhbWluaXNyYXI2QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzUzMTY2MTM3LCJleHAiOjE3NTMxNjY3Mzd9.LQgXBmyBpEPpAQyPjDNPL4m2xLF4XomfUPfoxeG0MKg
  */

  sendEmail({
    to: isUserExist.email,
    subject: "Password Reset",
    templateName: "forgetPassword",
    templateData: {
      name: isUserExist.name,
      resetUILink
    }
  })
  return null;
}

export const authService = {
  getNewAccessToken,
  changePassword,
  resetPassword,
  forgetPassword,
  setPassword
};
