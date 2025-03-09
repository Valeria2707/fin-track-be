import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResponseSendQueryDto {
  @ApiProperty()
  @IsString()
  response: string;
}
