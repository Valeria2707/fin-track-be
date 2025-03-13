import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResponseRemoveTransactionDto {
  @ApiProperty()
  @IsString()
  message?: string;
}
