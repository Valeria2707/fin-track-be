import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    type: String,
    description: 'User email address.',
    example: 'Bob@gmail.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
