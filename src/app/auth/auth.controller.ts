/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { CatchAsync } from "../utils/CatchAsync";
import { SendResponse } from "../utils/SendResponse";
import  httpStatus  from 'http-status-codes';
import { authService } from "./auth.services";

const credentialsLogin = CatchAsync( async (req: Request, res: Response, next: NextFunction) => {
     
    const login = await authService.credentialsLogin(req.body);
    // RESPONSE BACK
    SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `User Logged in Successfully`,
        data: login
    })
})

export const authControllers =  {
    credentialsLogin
}