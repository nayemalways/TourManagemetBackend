import { Response } from 'express';
import env from '../config/env';

interface AuthTokenInfo {
  accessToken?: string;
  refreshToken?: string;
}

export const SetCookies = (res: Response, tokenInfo: AuthTokenInfo) => {
  if (tokenInfo.accessToken) {
    res.cookie('accessToken', tokenInfo.accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: "none"
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie('refreshToken', tokenInfo.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'none'
    });
  }
};
