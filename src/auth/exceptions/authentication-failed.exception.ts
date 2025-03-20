export class AuthenticationFailedException extends Error {
  constructor(message = 'Authentication failed: invalid credentials') {
    super(message);
    this.name = 'AuthenticationFailedException';
  }
}
