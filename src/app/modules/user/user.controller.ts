/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import httpStatus from 'http-status-codes';
import { CatchAsync } from "../../utils/CatchAsync";
 

// Create a user
const createUser = CatchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService
    .CreateUserService(req.body); // INVOKED SERVICE FUNCTION
    
    // RESPONSE BACK
    res.status(httpStatus.CREATED).json({
        success: true,
        message: `User Created Successfully`,
        user
    })
})


// Get al users
const allUsers = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const allUsers = await UserService.GetAllUser();
    res.status(httpStatus.OK).json({
        success: true,
        data: allUsers
    })   
})


export const UserControllers = {
    createUser,
    allUsers
}