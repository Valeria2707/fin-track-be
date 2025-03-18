import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User]), ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, UserService],
})
export class AuthModule {}
