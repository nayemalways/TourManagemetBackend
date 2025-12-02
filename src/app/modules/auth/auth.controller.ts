/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { CatchAsync } from '../../utils/CatchAsync';
import { SendResponse } from '../../utils/SendResponse';
import httpStatus from 'http-status-codes';
import { authService } from './auth.services';
import AppError from '../../errorHelpers/AppError';
import { SetCookies } from '../../utils/setCookie';
import { JwtPayload } from 'jsonwebtoken';
import { createUserTokens } from '../../utils/user.tokens';
import env from '../../config/env';
import passport from 'passport';


const credentialsLogin = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await authService.credentialsLogin(req.body);

    passport.authenticate('local', async (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next(new AppError(info.statusCode, info.message));
      }
      const userTokens = await createUserTokens(user);

      SetCookies(res, userTokens);

      SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Looged in success!`,
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: user,
        },
      });
    })(req, res, next);
  }
);

const getNewAccessToken = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken; // GET REFRESH TOKEN FROM USER COOKIE
    if (!refreshToken)
      throw new AppError(httpStatus.BAD_REQUEST, 'No Refresh Token Received!');

    const newAccessToken = await authService.getNewAccessToken(refreshToken);
    SetCookies(res, newAccessToken); // SET ACCESS TOKEN IN BROWSER COOKIE

    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `New Access Token Genreted Successfully`,
      data: newAccessToken,
    });
  }
);

const logout = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const isProd = env.NODE_ENV === 'production'
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: isProd, // HTTP/HTTPS
      sameSite: isProd ? 'none' : 'lax',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProd, // HTTP/HTTPS
      sameSite: isProd ? 'none' : 'lax',
    });

    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `User Logout Successfully`,
      data: null,
    });
  }
);

const changePassword = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const { oldPassword, newPassword } = req.body;
    await authService.changePassword(decodedToken, oldPassword, newPassword);

    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Password Reset Successfully`,
      data: null,
    });
  }
);

const setPassword = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const { password } = req.body;
    await authService.setPassword(decodedToken, password);

    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Password set Successfully`,
      data: null,
    });
  }
);

const resetPassword = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    await authService.resetPassword(req.body, decodedToken as JwtPayload);

    SendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Password changed successfull',
      data: null,
    });
  }
);

const forgetPassword = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    await authService.forgetPassword(email);

    SendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Email sent successfully',
      data: null,
    });
  }
);

// -----------------------GOOGLE---------------------------------------
const googleRegister = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const redirect = req.query?.redirect || '/';

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: redirect as string,
    prompt: 'consent select_account',
  })(req, res, next);

})

 
// ------------ALTERNATIVE GOOGLE AUTH-----------------
// const googleRegister = CatchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const redirect = req.query.redirect || '/';
//     const oauth2Client = new OAuth2Client(
//       env.GOOGLE_CLIENT_ID,
//       env.GOOGLE_CLIENT_SECRET,
//       env.GOOGLE_CALLBACK_URL
//     );

//     const url = oauth2Client.generateAuthUrl({
//       access_type: 'offline',
//       scope: ['profile', 'email'],
//       prompt: 'consent',
//       state: redirect as string,
//     });

//     // Return URL as JSON instead of redirect
//     // res.json({ url });
//     res.redirect(url);
//   }
// );

const googleCallback = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : '';

    if (redirectTo.startsWith('/')) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user;
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

    const tokenInfo = await createUserTokens(user);
    SetCookies(res, tokenInfo);
    res.redirect(`${env?.FRONTEND_URL}/${redirectTo}`); // Redirect user to frontend url
  }
);

export const authControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  changePassword,
  googleRegister,
  googleCallback,
  resetPassword,
  forgetPassword,
  setPassword,
};
