import { IsEmail } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { IsPassword } from 'src/shared/decorators/password';

export class SignInUserDto {
  @ApiProperty({
    type: String,
    description: 'User email address.',
    example: 'Bob@gmail.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    type: String,
    description: 'User password.',
    example: 'SomePassword',
  })
  @IsPassword()
  password: string;
}
