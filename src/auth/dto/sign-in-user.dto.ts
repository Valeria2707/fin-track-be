import { IsEmail, IsString } from 'class-validator';
import { ISignInUser } from '../interface/sign-in-user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class SignInUserDto implements ISignInUser {
  @ApiProperty({
    type: String,
    description: 'User email address.',
    example: 'Bob@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'User password.',
    example: 'SomePassword',
  })
  @IsString()
  password: string;
}
