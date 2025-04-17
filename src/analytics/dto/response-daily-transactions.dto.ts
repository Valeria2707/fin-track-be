import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber } from 'class-validator';

export class ResponseDailyTransactionsDto {
  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiProperty()
  @IsNumber()
  income: number;

  @ApiProperty()
  @IsNumber()
  expense: number;
}
