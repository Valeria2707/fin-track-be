import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { IsPassword } from 'src/shared/decorators/password.decorator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  id: string;

  @ApiProperty({
    type: String,
    description: 'Name of the user.',
    example: 'John',
  })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    type: String,
    description: 'User’s email address.',
    example: 'John@mail.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    type: String,
    description: 'User’s password.',
    example: 'StrongPassword123',
  })
  @IsPassword()
  password: string;
}
