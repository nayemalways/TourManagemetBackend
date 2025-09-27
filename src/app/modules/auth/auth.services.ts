/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcrypt from 'bcrypt';
import AppError from '../../errorHelpers/AppError';
import httpStatus from 'http-status-codes';
import { User } from '../user/user.model';
import { IUser } from '../user/user.interface';
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from '../../utils/user.tokens';
import { JwtPayload } from 'jsonwebtoken';

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

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken =
    await createNewAccessTokenWithRefreshToken(refreshToken);
  return { accessToken: newAccessToken };
};

const resetPassword = async (
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
      httpStatus.BAD_REQUEST,
      "Password doesn't matched. Enter valid password"
    );

  user!.password = newPassword; // No need to hash password, because in user model we hashed password with pre hook middleware
  await user!.save(); // Save document

  return null;
};

export const authService = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
};
