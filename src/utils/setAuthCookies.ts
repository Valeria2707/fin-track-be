import { Response } from 'express';

interface Tokens {
  accessToken: string;
  refreshtoken: string;
}

export function setAuthCookies(res: Response, tokens: Tokens) {
  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', tokens.refreshtoken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
