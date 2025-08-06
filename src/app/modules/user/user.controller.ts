/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import httpStatus from 'http-status-codes';
import { CatchAsync } from "../../utils/CatchAsync";
import { SendResponse } from "../../utils/SendResponse";
import { verifyToken } from "../../utils/jwt";
import env from "../../../config/env";
import { JwtPayload } from "jsonwebtoken";
 

// Create a user
const createUser = CatchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService
    .CreateUserService(req.body); // INVOKED SERVICE FUNCTION
    
    // RESPONSE BACK
    SendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: `User Created Successfully`,
        data: user
    })
})


// Get all users
const allUsers = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserService.GetAllUser();
     
    SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `User Retrive Successfully`,
        data: users
    }) 
})


// Update single users
const updateUser = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const payload = req.body;
    const decodedToken = req.user; // From auth.middleware.ts
    const users = await UserService.updateUserService(userId, payload, decodedToken);
     
    SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `User Updated Successfully`,
        data: users
    }) 
})


export const UserControllers = {
    createUser,
    allUsers,
    updateUser
}