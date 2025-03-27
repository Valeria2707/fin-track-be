import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResponseMessageDto {
  @ApiProperty()
  @IsString()
  message?: string;
}
