import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePartialUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    type: String,
    description: 'Optional reset token for password recovery.',
    example: 'a1b2c3d4e5f67890abcdef1234567890',
  })
  @IsOptional()
  @IsString()
  resetToken?: string;
}
