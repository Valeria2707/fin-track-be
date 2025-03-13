import { JwtPayload } from '../auth/strategies/accessToken.strategy';

declare module 'express' {
  export interface Request {
    user?: JwtPayload & { refreshtoken?: string };
  }
}
