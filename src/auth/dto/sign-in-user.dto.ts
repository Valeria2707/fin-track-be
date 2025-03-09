import { IsEmail, IsString } from 'class-validator';
import { ISignInUser } from '../interface/sign-in-user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class SignInUserDto implements ISignInUser {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
    example: 'Bob@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
    example: 'SomePassword',
  })
  @IsString()
  password: string;
}
