import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResponseLogoutDto {
  @ApiProperty()
  @IsString()
  message?: string;
}
