import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResponseRemoveRenimder {
  @ApiProperty()
  @IsString()
  message?: string;
}
