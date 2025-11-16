import { Response } from 'express';
import env from '../config/env';

interface AuthTokenInfo {
  accessToken?: string;
  refreshToken?: string;
}

export const SetCookies = (res: Response, tokenInfo: AuthTokenInfo) => {
  const isProd = env.NODE_ENV === 'production';

  // Access Token
  if (tokenInfo.accessToken) {
    res.cookie('accessToken', tokenInfo.accessToken, {
      domain: 'tourista-server-omega.vercel.app',
      httpOnly: true, // <-- secure
      secure: isProd, // HTTP/HTTPS
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000 // 1 hour
    });
  }

  // Refresh Token
  if (tokenInfo.refreshToken) {
    res.cookie('refreshToken', tokenInfo.refreshToken, {
      domain: 'tourista-server-omega.vercel.app',
      httpOnly: true, // <-- secure
      secure: isProd, // HTTP/HTTPS
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });
  }
};


