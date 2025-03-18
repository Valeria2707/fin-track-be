import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResponseResetPasswordDto {
  @ApiProperty()
  @IsString()
  message?: string;
}
