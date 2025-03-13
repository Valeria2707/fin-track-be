import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ResponseGetIncomeVsExpensesDto {
  @ApiProperty()
  @IsNumber()
  income: number;

  @ApiProperty()
  @IsNumber()
  expenses: number;
}
