import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateTransactionDto {
  @ApiProperty({
    type: Number,
    description: 'This is a required property',
    example: 1,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
    example: 'income',
  })
  @IsString()
  type: string;

  @ApiProperty({
    type: Number,
    description: 'This is a required property',
    example: 2,
  })
  @IsNumber()
  category_id: number;

  @ApiProperty({
    type: Number,
    description: 'This is a required property',
    example: 1500.0,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
    example: '2024-12-25T00:00:00.000Z',
  })
  @Type(() => Date)
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
