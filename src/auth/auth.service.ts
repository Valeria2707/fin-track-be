import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignUpUserResponse } from './interface/sign-up-user-response.interface';
import * as argon2 from 'argon2';
import { SignInUserDto, SignUpUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async signUp(signUpUserDto: SignUpUserDto): Promise<SignUpUserResponse> {
    const { email, password } = signUpUserDto;

    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      return null;
    }

    const hash = await this.hashData(password);

    const id = uuidv4();

    const newUser = await this.userService.create({
      id,
      ...signUpUserDto,
      password: hash,
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);

    await this.updateRefreshToken(newUser.id, tokens.refreshtoken);

    return tokens;
  }

  async signIn(signInUserDto: SignInUserDto): Promise<SignUpUserResponse | null> {
    const user = await this.userService.findOneByEmail(signInUserDto.email);
    if (!user) return null;

    const passwordMatches = await argon2.verify(user.password, signInUserDto.password);
    if (!passwordMatches) return null;

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshtoken);

    return tokens;
  }

  async logout(userId: string) {
    return this.userService.findOneAndUpdate(userId, { refreshtoken: null });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: string, refreshtoken: string) {
    const hashedRefreshToken = await this.hashData(refreshtoken);

    this.userService.findOneAndUpdate(userId, {
      refreshtoken: hashedRefreshToken,
    });
  }

  async getTokens(userId: string, email: string) {
    const [accessToken, refreshtoken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_SECRET_EXPIRE'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_SECRET_EXPIRE'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshtoken,
    };
  }

  async refreshTokens(userId: string, refreshtoken: string) {
    const user = await this.userService.findOne(userId);

    const refreshTokenMatches = await argon2.verify(user.refreshtoken, refreshtoken);

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.email);

    await this.updateRefreshToken(user.id, tokens.refreshtoken);

    return tokens;
  }

  async resetPassword(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) return null;

    const token = randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await this.userService.findOneAndUpdate(user.id, {
      resetToken: token,
      resetTokenExpires: expiry,
    });

    const resetLink = `${process.env.CORS_ORIGIN}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: 'in-v3.mailjet.com',
      port: 587,
      auth: {
        user: process.env.MAILJET_API_KEY,
        pass: process.env.MAILJET_SECRET_KEY,
      },
    });

    await transporter.sendMail({
      from: '"Finance Tracker" zavadetska.valeria@lll.kpi.ua',
      to: user.email,
      subject: 'Password Reset',
      html: `
        <p>Hello ${user.name || ''},</p>
        <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    });
  }
}
