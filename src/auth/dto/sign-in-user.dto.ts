import { IsEmail, IsString, MinLength } from 'class-validator';
import { SignInUser } from '../interface/sign-in-user.interface';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
