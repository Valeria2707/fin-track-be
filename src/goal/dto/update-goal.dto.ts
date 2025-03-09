import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateGoalDto {
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
    example: 'Save for a vacation',
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'This is not a required property',
    example: 200000.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  target_amount: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'This is not a required property',
    example: 50000.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  current_amount: number;

  @ApiPropertyOptional({
    type: String,
    description: 'This is not a required property',
    example: '2025-12-31T23:59:59.999Z',
  })
  @IsOptional()
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

  @ApiPropertyOptional({
    enum: ['in-progress', 'completed', 'cancelled'],
    description: 'This is not a required property',
    example: 'in-progress',
  })
  @IsOptional()
  @IsEnum(['in-progress', 'completed', 'cancelled'])
  status: 'in-progress' | 'completed' | 'cancelled';
}
