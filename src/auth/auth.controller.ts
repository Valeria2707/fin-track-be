import { BadRequestException, Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { NewPasswordDto, ResetPasswordDto, ResponseMessageDto, ResponseTokensDto, SignInUserDto, SignUpUserDto } from './dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { setAuthCookies } from 'src/utils/setAuthCookies';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up user' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseTokensDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('sign-up')
  async signup(@Body() signUpUserDto: SignUpUserDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.signUp(signUpUserDto);

    setAuthCookies(res, result);

    return result;
  }

  @ApiOperation({ summary: 'Sign in user' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: ResponseTokensDto,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('sign-in')
  async signin(@Body() signInUserDto: SignInUserDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.signIn(signInUserDto);

    setAuthCookies(res, result);

    return result;
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
    type: ResponseTokensDto,
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

    return tokens;
  }

  @ApiOperation({ summary: 'Password reset' })
  @ApiCreatedResponse({ description: 'Reset link sent successfully', type: ResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Invalid email or bad request' })
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.email);
  }

  @ApiOperation({ summary: 'Update password' })
  @ApiCreatedResponse({ description: 'Password updated successfully', type: ResponseMessageDto })
  @ApiBadRequestResponse({ description: 'Invalid or expired reset token' })
  @Post('update-password')
  async updatePassword(@Body() dto: NewPasswordDto) {
    await this.authService.updatePassword(dto);
    return { message: 'Password updated successfully' };
  }
}
