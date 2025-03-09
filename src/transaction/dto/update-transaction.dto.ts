import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTransactionDto {
  @ApiPropertyOptional({
    type: Number,
    description: 'This is not a required property',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  user_id: number;

  @ApiPropertyOptional({
    type: String,
    description: 'This is not a required property',
    example: 'income',
  })
  @IsOptional()
  @IsString()
  type: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'This is not a required property',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  category_id: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'This is not a required property',
    example: 1500.0,
  })
  @IsOptional()
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({
    type: String,
    description: 'This is not a required property',
    example: '2024-12-25T00:00:00.000Z',
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  date: Date;

  @ApiPropertyOptional({
    type: String,
    description: 'This is not a required property',
    example: 'Bonus payment',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
