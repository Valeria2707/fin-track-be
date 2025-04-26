import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as argon2 from 'argon2';
import { NewPasswordDto, SignInUserDto, SignUpUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';
import { EmailService } from 'src/email/email.service';
import { AppException } from './exceptions/app-exception';
import { UpdateResetToken } from './types/update-reset-token';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  async signUp(signUpUserDto: SignUpUserDto) {
    const { email } = signUpUserDto;

    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new AppException('User already exists');
    }

    const id = uuidv4();

    const newUser = await this.userService.create({
      id,
      ...signUpUserDto,
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);

    return tokens;
  }

  async signIn(signInUserDto: SignInUserDto) {
    const user = await this.userService.findOneByEmail(signInUserDto.email);

    const passwordMatches = await argon2.verify(user.password, signInUserDto.password);
    if (!passwordMatches || !user) {
      throw new AppException('Wrong password or email');
    }

    const tokens = await this.getTokens(user.id, user.email);

    return tokens;
  }

  hashData(data: string) {
    return argon2.hash(data);
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

  async refreshTokens(refreshtoken: string) {
    const payload = await this.jwtService.verifyAsync(refreshtoken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    const tokens = await this.getTokens(payload.sub, payload.email);
    return tokens;
  }

  async resetPassword(email: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new AppException('User with this email does not exist');
    }

    const token = randomBytes(32).toString('hex');
    const expiryMinutes = this.configService.get<number>('RESET_TOKEN_EXPIRY_MINUTES');
    const expiry = new Date(Date.now() + expiryMinutes * 60 * 1000);

    const updateData: UpdateResetToken = {
      resetToken: token,
      resetTokenExpires: expiry,
    };

    await this.userService.update(user.id, updateData);

    const resetLink = `${process.env.CORS_ORIGIN}/auth/reset-password?token=${token}`;

    await this.emailService.sendPasswordResetEmail(user.email, user.name, resetLink);

    return true;
  }

  async updatePassword(newPasswordDto: NewPasswordDto) {
    const { token, newPassword } = newPasswordDto;

    const user = await this.userService.findByResetToken(token);

    if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
      throw new AppException('User with this email does not exist');
    }

    const hashedPassword = await this.hashData(newPassword);

    const updateData: UpdateResetToken = {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null,
    };

    await this.userService.update(user.id, updateData);

    return true;
  }
}
