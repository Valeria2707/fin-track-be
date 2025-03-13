import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResponseRemoveGoalDto {
  @ApiProperty()
  @IsString()
  message?: string;
}
