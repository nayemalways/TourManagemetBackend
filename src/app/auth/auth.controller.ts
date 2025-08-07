/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { CatchAsync } from "../utils/CatchAsync";
import { SendResponse } from "../utils/SendResponse";
import  httpStatus  from 'http-status-codes';
import { authService } from "./auth.services";
import AppError from "../errorHelpers/AppError";

const credentialsLogin = CatchAsync( async (req: Request, res: Response, next: NextFunction) => {
     
    const loginInfo = await authService.credentialsLogin(req.body);

    res.cookie("accesToken", loginInfo.accessToken, {
        httpOnly: true,
        secure: false
    }); // SER ACCESS TOKEN IN BROWSER COOKIE

    res.cookie("refreshToken", loginInfo.refreshToken, {
        httpOnly: true,
        secure: false
    }); // SER REFRESH TOKEN IN BROWSER COOKIE

    SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `User Logged in Successfully`,
        data: loginInfo
    })
})


const getNewAccessToken = CatchAsync( async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken; // ACCESS REFRESH TOKEN FROM USER REQUEST
    if(!refreshToken) throw new AppError(httpStatus.BAD_REQUEST, "No Refresh Token Received!")
    const tokenInfo = await authService.getNewAccessToken(refreshToken);

    SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `User Logged in Successfully`,
        data: tokenInfo
    })
})

export const authControllers =  {
    credentialsLogin,
    getNewAccessToken
}