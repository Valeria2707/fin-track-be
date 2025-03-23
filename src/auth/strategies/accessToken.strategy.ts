import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        return req.cookies?.accessToken || null;
      },
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  validate(payload: any) {
    return payload;
  }
}
