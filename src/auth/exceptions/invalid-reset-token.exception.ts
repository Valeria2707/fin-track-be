export class InvalidResetTokenException extends Error {
  constructor(message = 'Invalid or expired reset token') {
    super(message);
    this.name = 'InvalidResetTokenException';
  }
}
