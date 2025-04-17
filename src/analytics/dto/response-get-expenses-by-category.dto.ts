import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { TransactionType } from 'src/transaction/type/transaction';

export class ResponseGetExpensesByCategoryDto {
  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsEnum({ enum: TransactionType })
  type: TransactionType;
}
