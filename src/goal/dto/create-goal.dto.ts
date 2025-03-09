import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateGoalDto {
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
    example: 'Save for a vacation',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: Number,
    description: 'This is a required property',
    example: 200000.0,
  })
  @IsNumber()
  @Min(1)
  target_amount: number;

  @ApiProperty({
    type: Number,
    description: 'This is a required property',
    example: 50000.0,
  })
  @IsNumber()
  @Min(0)
  current_amount: number;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
    example: '2025-12-31T23:59:59.999Z',
  })
  @IsDate()
  @Type(() => Date)
  deadline: Date;

  @ApiPropertyOptional({
    type: String,
    description: 'This is not a required property',
    example: 'Save money for a dream vacation',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    enum: ['in-progress', 'completed', 'cancelled'],
    description: 'This is a required property',
    example: 'in-progress',
  })
  @IsEnum(['in-progress', 'completed', 'cancelled'])
  status: 'in-progress' | 'completed' | 'cancelled';
}
