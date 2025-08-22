/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { CatchAsync } from "../utils/CatchAsync";
import { SendResponse } from "../utils/SendResponse";
import  httpStatus  from 'http-status-codes';
import { authService } from "./auth.services";
import AppError from "../errorHelpers/AppError";
import { SetCookies } from "../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../utils/user.tokens";
import env from "../../config/env";
import passport from "passport";
 
const credentialsLogin = CatchAsync( async (req: Request, res: Response, next: NextFunction) => {
     
    // const loginInfo = await authService.credentialsLogin(req.body);

    passport.authenticate("local", async(err: any, user: any, info: any)=> {
 
        if(err) 
            return next( err  );

         if (!user) 
            return next(new AppError(httpStatus.FORBIDDEN, info.message));
        

        const userTokens = await createUserTokens(user);
        // const {password, ...rest} = user.toObject();

        SetCookies(res, userTokens);

        SendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: `Login Successfully`,
            data:  {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: user
            }
        })
    })(req, res, next);
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

    const decodedToken = req.user as JwtPayload;
    const {oldPassword, newPassword} = req.body;
    await authService.resetPassword(decodedToken, oldPassword, newPassword);


    SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Password Reset Successfully`,
        data: null
    })
})


const googleCallback = CatchAsync( async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : "";

    if(redirectTo.startsWith('/')){
        redirectTo = redirectTo.slice(1);
    }


   const user = req.user;
   if(!user) throw new AppError( httpStatus.NOT_FOUND,"User not found");

   const tokenInfo = await createUserTokens(user);
   SetCookies(res, tokenInfo);
   res.redirect(`${env?.FRONTEND_URL}/${redirectTo}`); // Redirect user to frontend url

})




export const authControllers =  {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallback
}