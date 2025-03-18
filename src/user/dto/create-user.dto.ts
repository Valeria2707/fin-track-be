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

  @ApiPropertyOptional({
    type: String,
    description: 'Optional reset token for password recovery.',
    example: 'a1b2c3d4e5f67890abcdef1234567890',
  })
  @IsOptional()
  @IsString()
  resetToken?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Expiry date of the reset token in ISO format.',
    example: '2025-03-19T12:34:56.789Z',
  })
  @IsOptional()
  resetTokenExpires?: Date;
}
