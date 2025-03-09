import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ResponseGetMonthlyAnalyticsDto {
  @ApiProperty()
  @IsString()
  month: string;

  @ApiProperty()
  @IsNumber()
  total_income: number;

  @ApiProperty()
  @IsNumber()
  total_expense: number;
}
