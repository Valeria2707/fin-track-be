import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsPassword } from 'src/shared/decorators/password.decorator';

export class NewPasswordDto {
  @ApiProperty({
    type: String,
    description: 'Reset token.',
    example: '9f1a2c3d4e5f6g7h8i9j0k1l2m3n4o5p',
  })
  @IsString()
  token: string;

  @ApiProperty({
    type: String,
    description: 'User password.',
    example: 'SomePassword',
  })
  @IsPassword()
  newPassword: string;
}
