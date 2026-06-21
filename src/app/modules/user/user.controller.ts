/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from 'express';
import { UserService } from './user.service';
import httpStatus from 'http-status-codes';
import { CatchAsync } from '../../utils/CatchAsync';
import { SendResponse } from '../../utils/SendResponse';
import { JwtPayload } from 'jsonwebtoken';


// Create a user
const createUser = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.CreateUserService(req.body);

    // RESPONSE BACK
    SendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: `User Created Successfully`,
      data: user,
    });
  }
);

// Get all users
const allUsers = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserService.GetAllUser();

    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `User Retrieved Successfully`,
      data: users,
    });
  }
);

// Update single users
const updateUser = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId as string;
    const payload = req.body;
    const decodedToken = req.user as JwtPayload; // From auth.middleware.ts
    const users = await UserService.updateUserService(
      userId,
      payload,
      decodedToken
    );

    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `User Updated Successfully`,
      data: users,
    });
  }
);

// Get me
const getMe = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const result = await UserService.getMe(user.userId);

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User fetched success!',
    data: result,
  });
});

// Get single user
const getSingleUser = CatchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await UserService.getSingleUser(userId as string);

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User fetched success!',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  allUsers,
  updateUser,
  getMe,
  getSingleUser,
};
