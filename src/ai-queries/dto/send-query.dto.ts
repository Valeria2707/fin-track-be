import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

export class SendQueryDto {
  @ApiProperty({
    type: Number,
    description: 'The unique identifier of the user.',
    example: 1,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    type: String,
    description: 'The message sent by the user.',
    example: 'How can I save more money?',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Context containing financial data related to the user.',
  })
  @ValidateNested()
  context: Record<string, unknown>;
}
