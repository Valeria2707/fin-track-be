import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ResponseGetCalculatedGoalProgressDto {
  @ApiProperty()
  @IsNumber()
  progress: number;
}
