import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

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
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsString()
  password: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Optional refresh token used for renewing the access token.',
    example: 'eyJhbGciOiJIUzI1NiIsInR...',
  })
  @IsOptional()
  refreshtoken?: string;
}
