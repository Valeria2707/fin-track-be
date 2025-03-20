import { BadRequestException, Body, ConflictException, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { ResetPasswordDto, ResponseMessageDto, SignInUserDto, SignUpUserDto } from './dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { setAuthCookies } from 'src/utils/setAuthCookies';
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception';
import { AuthenticationFailedException } from './exceptions/authentication-failed.exception';
import { UserNotFoundException } from './exceptions/user-not-found.exception';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up user' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseMessageDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('sign-up')
  @Post('sign-up')
  async signup(@Body() signUpUserDto: SignUpUserDto, @Res({ passthrough: true }) res: Response) {
    try {
      const result = await this.authService.signUp(signUpUserDto);

      setAuthCookies(res, result);

      return { message: 'Sign-up successful' };
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw new ConflictException('Email already exists');
      }
      throw new BadRequestException('Invalid data');
    }
  }

  @ApiOperation({ summary: 'Sign in user' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseMessageDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('sign-in')
  async signin(@Body() signInUserDto: SignInUserDto, @Res({ passthrough: true }) res: Response) {
    try {
      const result = await this.authService.signIn(signInUserDto);

      setAuthCookies(res, result);

      return { message: 'Sign-in successful' };
    } catch (error) {
      if (error instanceof AuthenticationFailedException) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Invalid data');
    }
  }

  @ApiOperation({ summary: 'Logout user' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseMessageDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @UseGuards(AccessTokenGuard)
  @Post('logout')
  @UseGuards(AccessTokenGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseMessageDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new BadRequestException('Refresh token not found in cookies');
    }

    const tokens = await this.authService.refreshTokens(refreshToken);

    setAuthCookies(res, tokens);

    return { message: 'Token refreshed' };
  }

  @ApiOperation({ summary: 'Password reset' })
  @ApiCreatedResponse({ description: 'Reset link sent successfully', type: ResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Invalid email or bad request' })
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    try {
      await this.authService.resetPassword(dto.email);
      return { message: 'Reset password link sent to your email' };
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Invalid email or request');
    }
  }
}
