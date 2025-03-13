import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Status } from '../enum/status.enum';

export class CreateGoalDto {
  @ApiProperty({
    type: Number,
    description: 'The ID of the user who owns the goal.',
    example: 1,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    type: String,
    description: 'The title of the financial goal.',
    example: 'Save for a vacation',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: Number,
    description: 'The target amount needed to achieve the goal. Must be at least 1.',
    example: 200000.0,
  })
  @IsNumber()
  @Min(1)
  target_amount: number;

  @ApiProperty({
    type: Number,
    description: 'The current amount saved towards the goal. Must be at least 0.',
    example: 50000.0,
  })
  @IsNumber()
  @Min(0)
  current_amount: number;

  @ApiProperty({
    type: String,
    description: 'The deadline for achieving the goal.',
    example: '2025-12-31T23:59:59.999Z',
  })
  @IsDate()
  @Type(() => Date)
  deadline: Date;

  @ApiPropertyOptional({
    type: String,
    description: 'A detailed description of the financial goal.',
    example: 'Save money for a dream vacation',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    enum: Status,
    description: 'The current status of the goal. Must be one of: in-progress, completed, or cancelled. Optional field.',
    example: 'in-progress',
  })
  @IsEnum(Status, { message: 'Status must be one of: in-progress, completed, cancelled' })
  status: Status;
}
