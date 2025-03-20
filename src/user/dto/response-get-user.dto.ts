import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class ResponseGetUserDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  resetToken?: string;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  resetTokenExpires?: Date;

  @ApiProperty()
  @IsDate()
  created_at: Date;

  @ApiProperty()
  @IsDate()
  updated_at: Date;
}
