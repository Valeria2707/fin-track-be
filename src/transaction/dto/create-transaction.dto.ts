import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
export class CreateTransactionDto {
  @ApiProperty({
    type: Number,
    description: 'ID of the user who created the transaction',
    example: 1,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    type: String,
    description: 'Type of transaction (e.g., income, expense)',
    example: 'income',
  })
  @IsString()
  type: string;

  @ApiProperty({
    type: Number,
    description: 'Category ID to which this transaction belongs',
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty({ message: 'category_id must not be empty' })
  category_id: number;

  @ApiProperty({
    type: Number,
    description: 'Amount of money involved in the transaction',
    example: 1500.0,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    type: String,
    description: 'Date when the transaction took place',
    example: '2024-12-25T00:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiPropertyOptional({
    type: String,
    description: 'Additional details or notes about the transaction',
    example: 'Bonus payment',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
