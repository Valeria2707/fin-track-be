import { applyDecorators } from '@nestjs/common';
import { IsString, MinLength } from 'class-validator';

export function IsPassword() {
  return applyDecorators(IsString(), MinLength(6, { message: 'Password must be at least 6 characters long' }));
}
