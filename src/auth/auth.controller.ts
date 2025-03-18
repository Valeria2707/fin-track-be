import { BadRequestException, Body, ConflictException, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { ResponseLogoutDto, ResponseRefreshTokenDto, ResponseSignInDto, ResponseSignUpDto, SignInUserDto, SignUpUserDto } from './dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up user' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseSignUpDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('sign-up')
  async signup(@Body() signUpUserDto: SignUpUserDto) {
    try {
      const result = await this.authService.signUp(signUpUserDto);

      if (!result) {
        throw new ConflictException('Email already exists');
      }

      return result;
    } catch {
      throw new BadRequestException('Invalid data');
    }
  }

  @ApiOperation({ summary: 'Sign in user' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseSignInDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('sign-in')
  async signin(@Body() signInUserDto: SignInUserDto) {
    try {
      const result = await this.authService.signIn(signInUserDto);
      if (!result) {
        throw new BadRequestException('Invalid data');
      }
      return result;
    } catch {
      throw new BadRequestException('Invalid data');
    }
  }

  @ApiOperation({ summary: 'Logout user' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseLogoutDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseRefreshTokenDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshtoken = req.user['refreshtoken'];
    return this.authService.refreshTokens(userId, refreshtoken);
  }
}
