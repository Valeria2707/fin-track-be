import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResponseTokensDto {
  @ApiProperty()
  @IsString()
  accessToken: string;

  @ApiProperty()
  @IsString()
  refreshToken: string;
}
