import { Response } from 'express';

interface Tokens {
  accessToken: string;
  refreshtoken: string;
}

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export function setAuthCookies(res: Response, tokens: Tokens) {
  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie('refreshToken', tokens.refreshtoken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: SEVEN_DAYS,
  });
}
