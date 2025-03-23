import { BadRequestException } from '@nestjs/common';

export class AuthenticationFailedException extends BadRequestException {
  constructor(message = 'Invalid email or password') {
    super(message);
  }
}
