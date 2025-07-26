/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { User } from "./user.model";
import httpStatus from 'http-status-codes';
import { UserService } from "./user.service";
import AppError from "../../errorHelpers/AppError";


const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        // IF USER EXIST RETURN FROM HERE
        const ExistingUser = await User.findOne({email});
        if(ExistingUser) {
           throw new AppError(httpStatus.BAD_REQUEST, "User already exist")
        } 

        // INVOKED SERVICE FUNCTION
        const user = await UserService.CreateUserService(req.body);

        // RESPONSE BACK
        res.status(httpStatus.CREATED).json({
            success: true,
            message: `User Created Successfully`,
            user
        })

        
        
    } catch (err: any) {
         next(err);
    }
}


export const UserControllers = {
    createUser
}