import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { Priority } from '../enum/goal';

export class ResponseGoalDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  target_amount: string;

  @ApiProperty()
  @IsString()
  current_amount: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  deadline: Date;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsEnum(Priority)
  priority: Priority;
}
