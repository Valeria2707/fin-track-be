import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

export class SendQueryDto {
  @ApiProperty({
    type: Number,
    description: 'ID користувача',
    example: 1,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    type: String,
    description: 'Повідомлення від користувача',
    example: 'How can I save more money?',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Контекст фінансових даних користувача',
  })
  @ValidateNested()
  context: Record<string, unknown>;
}
