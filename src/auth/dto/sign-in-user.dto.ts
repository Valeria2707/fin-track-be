import { IsEmail } from 'class-validator';
import { SignInUser } from '../types/sign-in-user.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsPassword } from 'src/shared/decorators/password.decorator';

export class SignInUserDto implements SignInUser {
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
