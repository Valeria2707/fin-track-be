import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { ReminderType } from '../interface/reminder';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReminderDto {
  @ApiProperty({
    type: Number,
    description: 'This is a required property',
    example: 1,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    enum: ReminderType,
    description: 'This is a required property',
    example: ReminderType.GENERAL,
  })
  @IsEnum(ReminderType)
  type: ReminderType;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
    example: "Don't forget to pay bill.",
  })
  @IsString()
  message: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
    example: '2024-12-28T10:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  reminder_date: Date;
}
