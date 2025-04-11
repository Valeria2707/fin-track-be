import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, ValidateNested } from 'class-validator';
import { ResponseGoalDto } from './response-goal.dto';
import { Type } from 'class-transformer';

export class ResponseOrderGoalDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => ResponseGoalDto)
  goal: ResponseGoalDto;

  @ApiProperty()
  @IsNumber()
  recommendedSum: number;
}
