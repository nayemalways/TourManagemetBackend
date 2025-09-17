import { Response } from 'express';

interface AuthTokenInfo {
  accessToken?: string;
  refreshToken?: string;
}

export const SetCookies = (res: Response, tokenInfo: AuthTokenInfo) => {
  if (tokenInfo.accessToken) {
    res.cookie('accessToken', tokenInfo.accessToken, {
      httpOnly: true,
      secure: false,
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie('refreshToken', tokenInfo.refreshToken, {
      httpOnly: true,
      secure: false,
    });
  }
};
