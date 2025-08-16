/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { CatchAsync } from "../utils/CatchAsync";
import { SendResponse } from "../utils/SendResponse";
import  httpStatus  from 'http-status-codes';
import { authService } from "./auth.services";
import AppError from "../errorHelpers/AppError";
import { SetCookies } from "../utils/setCookie";

const credentialsLogin = CatchAsync( async (req: Request, res: Response, next: NextFunction) => {
     
    const loginInfo = await authService.credentialsLogin(req.body);
    SetCookies(res, loginInfo)

    SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Login Successfully`,
        data: loginInfo
    })
})


const getNewAccessToken = CatchAsync( async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken; // GET REFRESH TOKEN FROM USER COOKIE
    if(!refreshToken) throw new AppError(httpStatus.BAD_REQUEST, "No Refresh Token Received!");

    const newAccessToken = await authService.getNewAccessToken(refreshToken);
     SetCookies(res, newAccessToken); // SET ACCESS TOKEN IN BROWSER COOKIE

    SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `New Access Token Genreted Successfully`,
        data: newAccessToken
    })
})


const logout = CatchAsync( async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `User Logout Successfully`,
        data: null
    })
})


const resetPassword = CatchAsync( async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req.user;
    const {oldPassword, newPassword} = req.body;
    await authService.resetPassword(decodedToken, oldPassword, newPassword);


    SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Password Reset Successfully`,
        data: null
    })
})




export const authControllers =  {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword
}