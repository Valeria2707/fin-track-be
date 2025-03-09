import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

export class ResponseGoalDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  user_id: number;

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
  @IsEnum(['in-progress', 'completed', 'cancelled'])
  status: 'in-progress' | 'completed' | 'cancelled';
}
