import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendQueryDto {
  @ApiProperty({
    type: String,
    description: 'The message sent by the user.',
    example: 'How can I save more money?',
  })
  @IsString()
  message: string;
}
