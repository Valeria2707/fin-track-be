import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  id: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
    example: 'John',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
    example: 'John@mail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
    example: 'StrongPassword123',
  })
  @IsString()
  password: string;

  @ApiPropertyOptional({
    type: String,
    description: 'This is a optional property',
    example: 'eyJhbGciOiJIUzI1NiIsInR...',
  })
  @IsOptional()
  accessToken?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'This is a optional property',
    example: 'eyJhbGciOiJIUzI1NiIsInR...',
  })
  @IsOptional()
  refreshtoken?: string;
}
