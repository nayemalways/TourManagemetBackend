import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { IsActive } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import AppError from '../errorHelpers/AppError';
import httpStatus from 'http-status-codes';
import env from '../config/env';

export const checkAuth =
  (...restRole: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      const verifyUser = verifyToken(
        accessToken as string,
        env.JWT_SECRET
      ) as JwtPayload;

      const isUserExists = await User.findOne(
        { email: verifyUser.email },
        { createdAt: 0, updatedAt: 0 }
      );

      if (!isUserExists)
        throw new AppError(httpStatus.BAD_REQUEST, "User Doesn't Exist");
      if (
        isUserExists.isActive === IsActive.BLOCKED ||
        isUserExists.isActive === IsActive.INACTIVE
      )
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'The User BLOCKED or INACTIVE'
        );
      if (isUserExists.isDeleted)
        throw new AppError(httpStatus.BAD_REQUEST, 'The user was DELETED');

      // CHECK
      if (!verifyUser)
        throw new AppError(httpStatus.BAD_REQUEST, 'Not Authorized');

      if (!restRole.includes(verifyUser.role))
        throw new AppError(
          httpStatus.FORBIDDEN,
          'You are not permitted to access this route'
        );

      req.user = verifyUser; // Set an global type for this line see on: interface > intex.d.ts
      next();
    } catch (error) {
      next(error);
    }
  };
